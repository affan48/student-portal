import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    });

    const formatted = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      priority: a.priority,
      publishedAt: a.publishedAt,
      isPinned: a.isPinned,
    }));

    return NextResponse.json({ announcements: formatted });
  } catch (error: any) {
    console.error("Announcements API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

