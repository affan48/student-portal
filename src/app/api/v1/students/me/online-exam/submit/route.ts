import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { attemptId } = await req.json();

    if (!attemptId) {
      return NextResponse.json({ message: "Attempt ID required" }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: true,
        onlineExam: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
    }

    // Server-side Grading
    let score = 0;
    for (const q of attempt.onlineExam.questions) {
      const studentAns = attempt.answers.find((a) => a.questionId === q.id);
      if (studentAns && studentAns.selectedOptionId) {
        const correctOpt = q.options.find((o) => o.isCorrect);
        if (correctOpt && correctOpt.id === studentAns.selectedOptionId) {
          score += q.marks;
        }
      }
    }

    const updated = await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        totalScore: score,
      },
    });

    return NextResponse.json({
      message: "Examination submitted successfully",
      score,
      totalMarks: attempt.onlineExam.totalMarks,
      submittedAt: updated.submittedAt,
    });
  } catch (error: any) {
    console.error("Submit exam error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

