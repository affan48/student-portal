import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, hashPassword, comparePassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (currentPassword) {
      const isValid = await comparePassword(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
      }
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: auth.userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

