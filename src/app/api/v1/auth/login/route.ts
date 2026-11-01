import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            program: true,
            department: true,
            currentSemester: true,
            section: true,
          },
        },
        facultyProfile: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (password) {
      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      studentId: user.studentProfile?.id,
      facultyId: user.facultyProfile?.id,
      name: `${user.firstName} ${user.lastName}`,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Record login activity
    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        details: `${user.role} Logged In`,
      },
    });

    const response = NextResponse.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        cnic: user.cnic,
      },
      studentProfile: user.studentProfile,
      facultyProfile: user.facultyProfile,
    });

    // Set HTTP-only cookie for secure session support
    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

