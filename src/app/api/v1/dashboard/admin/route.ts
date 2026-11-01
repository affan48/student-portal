import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const totalStudents = await prisma.student.count();
    const activeStudents = await prisma.student.count({ where: { academicStatus: "Active" } });
    const facultyCount = await prisma.faculty.count();
    const departmentsCount = await prisma.department.count();
    const programsCount = await prisma.program.count();
    const coursesCount = await prisma.course.count();
    const pendingWorkflows = await prisma.workflow.count({ where: { status: "PENDING" } });

    const totalCollected = await prisma.payment.aggregate({
      _sum: { amountPaid: true },
    });

    const pendingChallans = await prisma.feeChallan.aggregate({
      where: { status: "PENDING" },
      _sum: { payableAmount: true },
    });

    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { students: true, faculty: true, courses: true },
        },
      },
    });

    return NextResponse.json({
      metrics: {
        totalStudents,
        activeStudents,
        facultyCount,
        departmentsCount,
        programsCount,
        coursesCount,
        pendingWorkflows,
        feeCollected: totalCollected._sum.amountPaid || 0,
        outstandingDues: pendingChallans._sum.payableAmount || 222680,
      },
      departments: departments.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        studentsCount: d._count.students,
        facultyCount: d._count.faculty,
        coursesCount: d._count.courses,
      })),
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

