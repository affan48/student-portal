import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const userId = auth?.userId;

    const messages = await prisma.message.findMany({
      where: userId ? { OR: [{ recipientId: userId }, { senderId: userId }] } : {},
      include: {
        sender: true,
        recipient: true,
      },
      orderBy: { sentAt: "desc" },
    });

    const formatted = messages.map((m) => ({
      id: m.id,
      subject: m.subject,
      body: m.body,
      sender: `${m.sender.firstName} ${m.sender.lastName} (${m.sender.role})`,
      recipient: `${m.recipient.firstName} ${m.recipient.lastName}`,
      sentAt: m.sentAt,
      isRead: m.isRead,
    }));

    return NextResponse.json({ messages: formatted });
  } catch (error: any) {
    console.error("Communication GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const { recipientEmail, subject, body } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ message: "Subject and body required" }, { status: 400 });
    }

    const recipient = await prisma.user.findFirst({
      where: recipientEmail ? { email: recipientEmail } : { role: "FACULTY" },
    });

    if (!recipient) {
      return NextResponse.json({ message: "Recipient not found" }, { status: 404 });
    }

    const senderUser = await prisma.user.findFirst({
      where: auth?.userId ? { id: auth.userId } : { role: "STUDENT" },
    });

    if (!senderUser) {
      return NextResponse.json({ message: "Sender not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: senderUser.id,
        recipientId: recipient.id,
        subject,
        body,
      },
    });

    return NextResponse.json({ message: "Message sent successfully", data: message });
  } catch (error: any) {
    console.error("Communication POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

