import { NextRequest, NextResponse } from "next/server";
import { getFullAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getFullAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
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
      accessibility: user.accessibility,
    });
  } catch (error: any) {
    console.error("Auth Me API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

