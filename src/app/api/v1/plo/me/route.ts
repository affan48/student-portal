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

    const attainments = await prisma.pLOAttainment.findMany({
      where: { studentId: student.id },
      include: { plo: true },
      orderBy: { plo: { code: "asc" } },
    });

    const plos = attainments.map((a) => ({
      id: a.id,
      code: a.plo.code,
      description: a.plo.description,
      attainmentPercentage: a.attainmentPercentage,
      benchmark: 60.0, // PEC / HEC 60% minimum threshold benchmark
      status: a.attainmentPercentage >= 60.0 ? "ACHIEVED" : "NEEDS_IMPROVEMENT",
    }));

    return NextResponse.json({ plos });
  } catch (error: any) {
    console.error("PLO API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

