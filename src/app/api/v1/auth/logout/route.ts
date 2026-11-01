import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (auth) {
      await prisma.loginActivity.create({
        data: {
          userId: auth.userId,
          action: "LOGOUT",
          details: "Student Logged Out",
        },
      });
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("token");
    return response;
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

