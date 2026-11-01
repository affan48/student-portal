import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const faculty = await prisma.faculty.findMany({
      include: {
        user: true,
        department: true,
        offerings: {
          include: {
            course: true,
          },
        },
      },
    });

    const formatted = faculty.map((f) => ({
      id: f.id,
      name: `${f.user.firstName} ${f.user.lastName}`,
      email: f.user.email,
      designation: f.designation,
      department: f.department.name,
      coursesCount: f.offerings.length,
      courses: f.offerings.map((o) => `${o.course.code} - ${o.course.name}`),
    }));

    return NextResponse.json({ faculty: formatted });
  } catch (error: any) {
    console.error("Admin faculty GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

