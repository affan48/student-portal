import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
      include: {
        user: true,
        department: true,
        program: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const seats = await prisma.examSeat.findMany({
      where: { studentId: student.id },
      include: {
        schedule: {
          include: {
            examination: true,
            courseOffering: {
              include: {
                course: true,
                classroom: true,
              },
            },
          },
        },
      },
    });

    const seatingPlans = seats.map((s) => ({
      id: s.id,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      registrationNo: student.registrationNo,
      enrollmentNo: student.enrollmentNo,
      program: student.program.name,
      courseCode: s.schedule.courseOffering.course.code,
      courseName: s.schedule.courseOffering.course.name,
      examDate: new Date(s.schedule.examDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      startTime: s.schedule.startTime,
      endTime: s.schedule.endTime,
      reportingTime: "08:30 AM",
      venue: s.roomNumber,
      seatNumber: s.seatNumber,
      instructions: [
        "Candidates must display their university ID card and verified Admit Card.",
        "Mobile phones, smartwatches, and programmable calculators are strictly prohibited.",
        "Late arrival beyond 15 minutes will not be permitted into the examination hall.",
      ],
    }));

    return NextResponse.json({ seatingPlans });
  } catch (error: any) {
    console.error("Seating plan error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

