import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
    });

    const todos = await prisma.todo.findMany({
      where: student ? { studentId: student.id } : {},
      orderBy: [{ completed: "asc" }, { dueDate: "asc" }],
    });

    return NextResponse.json({ todos });
  } catch (error: any) {
    console.error("Todos GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, completed } = await req.json();
    const updated = await prisma.todo.update({
      where: { id },
      data: { completed },
    });
    return NextResponse.json({ todo: updated });
  } catch (error: any) {
    console.error("Todos PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

