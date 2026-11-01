import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-for-university-ums-fall2026-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super-secret-refresh-key-for-university-ums-fall2026-production";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  studentId?: string;
  facultyId?: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<TokenPayload | null> {
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    const cookieToken = req.cookies.get("token")?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) return null;
  const decoded = verifyAccessToken(token);
  if (!decoded) return null;

  return decoded;
}

export async function getFullAuthUser(req: NextRequest) {
  const tokenUser = await getAuthUser(req);
  if (!tokenUser) return null;

  const user = await prisma.user.findUnique({
    where: { id: tokenUser.userId },
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
      accessibility: true,
    },
  });

  return user;
}

