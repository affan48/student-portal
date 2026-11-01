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
            timetables: {
              include: {
                classroom: true,
              },
            },
          },
        },
      },
    });

    const timetableEntries: Array<{
      id: string;
      courseCode: string;
      courseName: string;
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      room: string;
      instructor: string;
    }> = [];

    for (const r of registrations) {
      const co = r.courseOffering;
      const instructorName = co.faculty?.user
        ? `${co.faculty.user.firstName} ${co.faculty.user.lastName}`
        : "Faculty";

      for (const t of co.timetables) {
        timetableEntries.push({
          id: t.id,
          courseCode: co.course.code,
          courseName: co.course.name,
          dayOfWeek: t.dayOfWeek,
          startTime: t.startTime,
          endTime: t.endTime,
          room: t.classroom.name,
          instructor: instructorName,
        });
      }
    }

    return NextResponse.json({ timetable: timetableEntries });
  } catch (error: any) {
    console.error("Timetable API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

