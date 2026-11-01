import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
      include: {
        currentSemester: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // All offerings for current semester
    const offerings = await prisma.courseOffering.findMany({
      where: { semesterId: student.currentSemesterId },
      include: {
        course: true,
        faculty: { include: { user: true } },
        classroom: true,
        registrations: {
          where: { studentId: student.id },
        },
      },
    });

    const courses = offerings.map((o) => {
      const isRegistered = o.registrations.length > 0 && o.registrations[0].status === "APPROVED";
      const facultyUser = o.faculty?.user;
      return {
        offeringId: o.id,
        courseId: o.course.id,
        code: o.course.code,
        name: o.course.name,
        creditHours: o.course.creditHours,
        isElective: o.course.isElective,
        classroom: o.classroom.name,
        timings: o.timingsSummary,
        instructor: facultyUser ? `${facultyUser.firstName} ${facultyUser.lastName}` : "Faculty",
        isRegistered,
        status: isRegistered ? o.registrations[0].status : "AVAILABLE",
      };
    });

    const registeredCredits = courses
      .filter((c) => c.isRegistered)
      .reduce((acc, c) => acc + c.creditHours, 0);

    return NextResponse.json({
      semester: student.currentSemester.name,
      registrationOpen: student.currentSemester.registrationOpen,
      maxCreditsAllowed: 21,
      registeredCredits,
      courses,
    });
  } catch (error: any) {
    console.error("Registration GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { courseOfferingIds } = await req.json();

    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    if (!Array.isArray(courseOfferingIds)) {
      return NextResponse.json({ message: "Course offering IDs must be an array" }, { status: 400 });
    }

    // Validate offerings
    const offerings = await prisma.courseOffering.findMany({
      where: { id: { in: courseOfferingIds } },
      include: { course: true },
    });

    const totalCredits = offerings.reduce((acc, o) => acc + o.course.creditHours, 0);
    if (totalCredits > 21) {
      return NextResponse.json(
        { message: `Total credits (${totalCredits}) exceeds maximum limit of 21 credit hours` },
        { status: 400 }
      );
    }

    // Register each course offering
    for (const offId of courseOfferingIds) {
      await prisma.courseRegistration.upsert({
        where: {
          studentId_courseOfferingId: {
            studentId: student.id,
            courseOfferingId: offId,
          },
        },
        update: {
          status: "APPROVED",
        },
        create: {
          studentId: student.id,
          courseOfferingId: offId,
          status: "APPROVED",
        },
      });
    }

    return NextResponse.json({
      message: `Successfully registered for ${courseOfferingIds.length} courses (${totalCredits} credit hours)`,
    });
  } catch (error: any) {
    console.error("Registration POST error:", error);
    return NextResponse.json({ message: "Registration failed: " + error.message }, { status: 500 });
  }
}

