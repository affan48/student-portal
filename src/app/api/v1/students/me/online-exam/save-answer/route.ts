import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { attemptId, questionId, selectedOptionId, textAnswer } = await req.json();

    if (!attemptId || !questionId) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt || attempt.status !== "IN_PROGRESS") {
      return NextResponse.json({ message: "Attempt is closed or invalid" }, { status: 403 });
    }

    const answer = await prisma.examAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      update: {
        selectedOptionId,
        textAnswer,
        savedAt: new Date(),
      },
      create: {
        attemptId,
        questionId,
        selectedOptionId,
        textAnswer,
        savedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, answerId: answer.id, savedAt: answer.savedAt });
  } catch (error: any) {
    console.error("Save answer error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

