import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { offeringId, date, topic, records } = await req.json();

    if (!offeringId || !records || !Array.isArray(records)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const session = await prisma.attendanceSession.create({
      data: {
        courseOfferingId: offeringId,
        date: date ? new Date(date) : new Date(),
        topic: topic || "Course Lecture Session",
      },
    });

    for (const r of records) {
      await prisma.attendanceRecord.create({
        data: {
          sessionId: session.id,
          studentId: r.studentId,
          status: r.status || "PRESENT",
          remarks: r.remarks || null,
        },
      });
    }

    return NextResponse.json({
      message: `Marked attendance for ${records.length} students in session ${session.id}`,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Faculty attendance error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

