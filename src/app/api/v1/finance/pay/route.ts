import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { challanId, paymentMethod, reference } = await req.json();

    if (!challanId || !reference) {
      return NextResponse.json({ message: "Challan and reference required" }, { status: 400 });
    }

    const challan = await prisma.feeChallan.findUnique({
      where: { id: challanId },
      include: {
        student: true,
        semester: true,
      },
    });

    if (!challan) {
      return NextResponse.json({ message: "Challan not found" }, { status: 404 });
    }

    // Atomic transaction: create payment, create credit entry in ledger, update challan, update student balance
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          challanId: challan.id,
          studentId: challan.studentId,
          amountPaid: challan.payableAmount,
          paymentMethod: paymentMethod || "ONLINE_TRANSFER",
          paymentReference: reference,
          status: "VERIFIED",
          paidAt: new Date(),
        },
      });

      const newBalance = Math.max(0, challan.student.currentBalance - challan.payableAmount);

      await tx.financialLedger.create({
        data: {
          studentId: challan.studentId,
          semesterId: challan.semesterId,
          description: `Fee Payment - Ref: ${reference}`,
          feeNature: "Online Fee Payment",
          session: challan.semester.name,
          transactionDate: new Date(),
          charging: 0.0,
          amount: challan.payableAmount,
          currentBalance: newBalance,
          transactionType: "PAYMENT",
        },
      });

      await tx.student.update({
        where: { id: challan.studentId },
        data: {
          currentBalance: newBalance,
        },
      });

      const updatedChallan = await tx.feeChallan.update({
        where: { id: challan.id },
        data: {
          status: "PAID",
        },
      });

      return { payment, updatedChallan, newBalance };
    });

    return NextResponse.json({
      message: "Payment successfully verified and recorded in general ledger",
      paymentId: result.payment.id,
      newBalance: result.newBalance,
    });
  } catch (error: any) {
    console.error("Payment API error:", error);
    return NextResponse.json({ message: "Payment processing failed: " + error.message }, { status: 500 });
  }
}

