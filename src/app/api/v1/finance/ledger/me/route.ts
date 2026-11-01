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
        currentSemester: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const ledger = await prisma.financialLedger.findMany({
      where: { studentId: student.id },
      orderBy: { transactionDate: "asc" },
    });

    const formattedLedger = ledger.map((l) => {
      const d = new Date(l.transactionDate);
      return {
        id: l.id,
        description: l.description,
        feeNature: l.feeNature,
        session: l.session,
        date: d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        charging: l.charging,
        amount: l.amount,
        currentBalance: l.currentBalance,
        transactionType: l.transactionType,
      };
    });

    return NextResponse.json({
      currentBalance: student.currentBalance,
      loanAmount: student.loanAmount,
      totalCharging: ledger.reduce((acc, cur) => acc + cur.charging, 0),
      totalPaid: ledger.reduce((acc, cur) => acc + cur.amount, 0),
      ledger: formattedLedger,
    });
  } catch (error: any) {
    console.error("Finance ledger API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

