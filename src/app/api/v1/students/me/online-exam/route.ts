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

    const onlineExam = await prisma.onlineExam.findFirst({
      where: { isActive: true },
      include: {
        courseOffering: {
          include: { course: true },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
          include: {
            options: {
              select: {
                id: true,
                optionText: true,
                // Never expose isCorrect to student frontend!
              },
            },
          },
        },
      },
    });

    if (!onlineExam) {
      return NextResponse.json({ message: "No active online examination" }, { status: 404 });
    }

    // Find or create attempt
    let attempt = await prisma.examAttempt.findUnique({
      where: {
        onlineExamId_studentId: {
          onlineExamId: onlineExam.id,
          studentId: student.id,
        },
      },
      include: {
        answers: true,
      },
    });

    if (!attempt) {
      attempt = await prisma.examAttempt.create({
        data: {
          onlineExamId: onlineExam.id,
          studentId: student.id,
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
        include: {
          answers: true,
        },
      });
    }

    // Calculate remaining server seconds
    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(attempt.startedAt).getTime()) / 1000
    );
    const totalAllowedSeconds = onlineExam.durationMinutes * 60;
    const remainingSeconds = Math.max(0, totalAllowedSeconds - elapsedSeconds);

    const savedAnswersMap: Record<string, string> = {};
    for (const ans of attempt.answers) {
      if (ans.selectedOptionId) {
        savedAnswersMap[ans.questionId] = ans.selectedOptionId;
      }
    }

    return NextResponse.json({
      exam: {
        id: onlineExam.id,
        attemptId: attempt.id,
        title: onlineExam.title,
        courseName: onlineExam.courseOffering.course.name,
        courseCode: onlineExam.courseOffering.course.code,
        instructions: onlineExam.instructions,
        durationMinutes: onlineExam.durationMinutes,
        totalMarks: onlineExam.totalMarks,
        remainingSeconds,
        status: attempt.status,
        totalScore: attempt.totalScore,
        questions: onlineExam.questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          questionType: q.questionType,
          marks: q.marks,
          options: q.options,
        })),
        savedAnswers: savedAnswersMap,
      },
    });
  } catch (error: any) {
    console.error("Online exam error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

