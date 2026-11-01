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

    const schedules = await prisma.examinationSchedule.findMany({
      include: {
        examination: true,
        courseOffering: {
          include: {
            course: true,
            classroom: true,
          },
        },
        seats: {
          where: { studentId: student.id },
        },
      },
      orderBy: { examDate: "asc" },
    });

    const exams = schedules.map((s) => ({
      id: s.id,
      examTitle: s.examination.title,
      examType: s.examination.examType,
      courseCode: s.courseOffering.course.code,
      courseName: s.courseOffering.course.name,
      examDate: new Date(s.examDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      startTime: s.startTime,
      endTime: s.endTime,
      roomNumber: s.seats[0]?.roomNumber || s.courseOffering.classroom.name,
      seatNumber: s.seats[0]?.seatNumber || "Assigned on arrival",
      paperType: s.paperType,
    }));

    return NextResponse.json({ exams });
  } catch (error: any) {
    console.error("Exams API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

