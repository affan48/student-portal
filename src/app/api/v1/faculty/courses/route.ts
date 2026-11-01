import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const faculty = await prisma.faculty.findFirst({
      where: auth?.facultyId ? { id: auth.facultyId } : {},
      include: { user: true, department: true },
    });

    const offerings = await prisma.courseOffering.findMany({
      where: faculty ? { facultyId: faculty.id } : {},
      include: {
        course: true,
        section: true,
        classroom: true,
        registrations: {
          include: {
            student: {
              include: { user: true },
            },
          },
        },
        assessments: true,
      },
    });

    const courses = offerings.map((o) => ({
      id: o.id,
      code: o.course.code,
      name: o.course.name,
      creditHours: o.course.creditHours,
      section: o.section.name,
      classroom: o.classroom.name,
      timings: o.timingsSummary,
      enrolledCount: o.registrations.length,
      assessmentsCount: o.assessments.length,
      students: o.registrations.map((r) => ({
        studentId: r.student.id,
        name: `${r.student.user.firstName} ${r.student.user.lastName}`,
        registrationNo: r.student.registrationNo,
        enrollmentNo: r.student.enrollmentNo,
      })),
    }));

    return NextResponse.json({
      faculty: faculty
        ? {
            name: `${faculty.user.firstName} ${faculty.user.lastName}`,
            designation: faculty.designation,
            department: faculty.department.name,
          }
        : null,
      courses,
    });
  } catch (error: any) {
    console.error("Faculty courses error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

