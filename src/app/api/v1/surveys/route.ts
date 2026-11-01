import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
    });

    const surveys = await prisma.survey.findMany({
      where: { isActive: true },
      include: {
        courseOffering: {
          include: {
            course: true,
            faculty: { include: { user: true } },
          },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
        },
        responses: student
          ? {
              where: { studentId: student.id },
            }
          : false,
      },
    });

    const formatted = surveys.map((s) => {
      const instructorUser = s.courseOffering.faculty?.user;
      return {
        id: s.id,
        title: s.title,
        description: s.description,
        courseCode: s.courseOffering.course.code,
        courseName: s.courseOffering.course.name,
        instructor: instructorUser
          ? `${instructorUser.firstName} ${instructorUser.lastName}`
          : "Faculty",
        isSubmitted: (s.responses?.length || 0) > 0,
        questions: s.questions,
      };
    });

    return NextResponse.json({ surveys: formatted });
  } catch (error: any) {
    console.error("Surveys API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { surveyId, answers } = await req.json();

    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return NextResponse.json({ message: "Survey not found" }, { status: 404 });
    }

    const response = await prisma.surveyResponse.upsert({
      where: {
        surveyId_studentId: {
          surveyId,
          studentId: student.id,
        },
      },
      update: {
        answersJson: JSON.stringify(answers),
        submittedAt: new Date(),
      },
      create: {
        surveyId,
        studentId: student.id,
        courseOfferingId: survey.courseOfferingId,
        answersJson: JSON.stringify(answers),
      },
    });

    return NextResponse.json({ message: "Evaluation response submitted successfully", response });
  } catch (error: any) {
    console.error("Survey submission error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

