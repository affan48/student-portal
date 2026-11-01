import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: true,
        offerings: {
          include: {
            faculty: { include: { user: true } },
            classroom: true,
            _count: { select: { registrations: true } },
          },
        },
      },
      orderBy: { code: "asc" },
    });

    const formatted = courses.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      creditHours: c.creditHours,
      department: c.department.name,
      offeringsCount: c.offerings.length,
      offerings: c.offerings.map((o) => ({
        id: o.id,
        instructor: o.faculty?.user
          ? `${o.faculty.user.firstName} ${o.faculty.user.lastName}`
          : "Unassigned",
        classroom: o.classroom.name,
        timings: o.timingsSummary,
        enrolled: o._count.registrations,
      })),
    }));

    return NextResponse.json({ courses: formatted });
  } catch (error: any) {
    console.error("Admin courses GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

