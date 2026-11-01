import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      include: {
        programs: true,
        _count: {
          select: { students: true, faculty: true, courses: true },
        },
      },
    });

    const formatted = departments.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      headOfDept: d.headOfDept,
      studentsCount: d._count.students,
      facultyCount: d._count.faculty,
      coursesCount: d._count.courses,
      programs: d.programs.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        durationYears: p.durationYears,
      })),
    }));

    return NextResponse.json({ departments: formatted });
  } catch (error: any) {
    console.error("Admin departments error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

