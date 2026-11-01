import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const registrations = await prisma.courseRegistration.findMany({
      where: { studentId: student.id, status: "APPROVED" },
      include: {
        courseOffering: {
          include: {
            course: true,
            faculty: {
              include: { user: true },
            },
            classroom: true,
            timetables: true,
            assessments: {
              include: {
                results: {
                  where: { studentId: student.id },
                },
              },
            },
            materials: true,
          },
        },
      },
    });

    const courses = registrations.map((r) => {
      const co = r.courseOffering;
      const facultyUser = co.faculty?.user;
      return {
        id: co.id,
        code: co.course.code,
        name: co.course.name,
        creditHours: co.course.creditHours,
        lectureHours: co.course.lectureHours,
        labHours: co.course.labHours,
        isElective: co.course.isElective,
        classroom: co.classroom.name,
        timings: co.timingsSummary,
        instructor: {
          name: facultyUser ? `${facultyUser.firstName} ${facultyUser.lastName}` : "Faculty",
          email: facultyUser?.email || "faculty@uit.edu",
          designation: co.faculty?.designation || "Instructor",
        },
        assessments: co.assessments.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.assessmentType,
          totalMarks: a.totalMarks,
          weightage: a.weightage,
          obtainedMarks: a.results[0]?.obtainedMarks ?? null,
        })),
        materials: co.materials,
      };
    });

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Courses API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

