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

    const workflows = await prisma.workflow.findMany({
      where: { studentId: student.id },
      include: { steps: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workflows });
  } catch (error: any) {
    console.error("Workflow GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { requestType, title, description } = await req.json();

    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const approverRoles: Record<string, string> = {
      FEE_INSTALLMENT: "FINANCE_OFFICER",
      COURSE_WITHDRAWAL: "REGISTRAR",
      LEAVE: "DEPT_HEAD",
      CLEARANCE: "REGISTRAR",
      TRANSCRIPT_REQUEST: "REGISTRAR",
    };

    const workflow = await prisma.workflow.create({
      data: {
        studentId: student.id,
        requestType: requestType || "GENERAL_REQUEST",
        title,
        description,
        status: "PENDING",
        currentApproverRole: approverRoles[requestType] || "REGISTRAR",
      },
    });

    return NextResponse.json({
      message: "Academic workflow request submitted successfully",
      workflow,
    });
  } catch (error: any) {
    console.error("Workflow POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

