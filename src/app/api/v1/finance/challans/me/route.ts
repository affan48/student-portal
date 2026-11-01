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
        program: true,
        department: true,
        currentSemester: true,
        section: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const challans = await prisma.feeChallan.findMany({
      where: { studentId: student.id },
      include: {
        semester: true,
        payments: true,
      },
      orderBy: { issueDate: "desc" },
    });

    const formattedChallans = challans.map((c) => ({
      id: c.id,
      challanNumber: c.challanNumber,
      semester: c.semester.name,
      issueDate: new Date(c.issueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      dueDate: new Date(c.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      totalAmount: c.totalAmount,
      payableAmount: c.payableAmount,
      status: c.status,
      bankDetails: c.bankDetails,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      registrationNo: student.registrationNo,
      enrollmentNo: student.enrollmentNo,
      program: student.program.name,
      section: student.section.name,
      payments: c.payments,
    }));

    return NextResponse.json({ challans: formattedChallans });
  } catch (error: any) {
    console.error("Challans API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

