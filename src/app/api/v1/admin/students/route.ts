import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { registrationNo: { contains: search } },
            { enrollmentNo: { contains: search } },
            { user: { firstName: { contains: search } } },
            { user: { lastName: { contains: search } } },
          ],
        }
      : {};

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: true,
          program: true,
          department: true,
          section: true,
          currentSemester: true,
        },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    const formatted = students.map((s) => ({
      id: s.id,
      name: `${s.user.firstName} ${s.user.lastName}`,
      email: s.user.email,
      registrationNo: s.registrationNo,
      enrollmentNo: s.enrollmentNo,
      program: s.program.name,
      department: s.department.name,
      section: s.section.name,
      semester: s.currentSemester.name,
      cgpa: s.cgpa,
      currentBalance: s.currentBalance,
      academicStatus: s.academicStatus,
    }));

    return NextResponse.json({
      students: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Admin students GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, registrationNo, enrollmentNo, departmentId, programId, semesterId, sectionId } = data;

    if (!email || !registrationNo || !enrollmentNo) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: "STUDENT",
        firstName: firstName || "Student",
        lastName: lastName || "User",
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        registrationNo,
        enrollmentNo,
        departmentId: departmentId || (await prisma.department.findFirst())?.id || "",
        programId: programId || (await prisma.program.findFirst())?.id || "",
        currentSemesterId: semesterId || (await prisma.semester.findFirst({ where: { isCurrent: true } }))?.id || "",
        sectionId: sectionId || (await prisma.section.findFirst())?.id || "",
        cgpa: 0.0,
        currentBalance: 0.0,
      },
      include: { user: true },
    });

    return NextResponse.json({ message: "Student created successfully", student });
  } catch (error: any) {
    console.error("Admin students POST error:", error);
    return NextResponse.json({ message: "Failed to create student: " + error.message }, { status: 500 });
  }
}

