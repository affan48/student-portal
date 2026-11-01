import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { assessmentId, results } = await req.json();

    if (!assessmentId || !results || !Array.isArray(results)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    for (const res of results) {
      await prisma.assessmentResult.upsert({
        where: {
          assessmentId_studentId: {
            assessmentId,
            studentId: res.studentId,
          },
        },
        update: {
          obtainedMarks: res.obtainedMarks,
          remarks: res.remarks || null,
          submittedAt: new Date(),
        },
        create: {
          assessmentId,
          studentId: res.studentId,
          obtainedMarks: res.obtainedMarks,
          remarks: res.remarks || null,
        },
      });
    }

    return NextResponse.json({
      message: `Successfully updated assessment marks for ${results.length} students`,
    });
  } catch (error: any) {
    console.error("Assessment marks error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

