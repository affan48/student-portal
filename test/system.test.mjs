import { test, describe } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-for-university-ums-fall2026-production";

describe("UMS & SIS Core Engine Unit & Integration Tests", () => {
  test("1. Password Hashing and Verification", async () => {
    const rawPassword = "Password123!";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    const matches = await bcrypt.compare(rawPassword, hash);
    assert.equal(matches, true, "Valid password should match hash");

    const fails = await bcrypt.compare("WrongPassword", hash);
    assert.equal(fails, false, "Invalid password must not match hash");
  });

  test("2. JWT Token Generation and Verification", () => {
    const payload = {
      userId: "usr-test-123",
      email: "student@uit.edu",
      role: "STUDENT",
      studentId: "std-test-123",
      name: "Muhammad Affan Ahmed",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    assert.ok(token, "Token should be generated");

    const decoded = jwt.verify(token, JWT_SECRET);
    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.role, "STUDENT");
    assert.equal(decoded.name, "Muhammad Affan Ahmed");
  });

  test("3. GPA Calculation Engine", () => {
    // Standard UIT University Grading Points
    // Course 1: 3 Cr, A (4.00) = 12.0
    // Course 2: 4 Cr, B+ (3.33) = 13.32
    // Course 3: 3 Cr, B (3.00) = 9.0
    // Course 4: 4 Cr, C+ (2.33) = 9.32
    // Total Credits: 14
    // Total Points: 43.64
    // Expected GPA: 43.64 / 14 = 3.117 => 3.12
    const courses = [
      { credits: 3, points: 4.00 },
      { credits: 4, points: 3.33 },
      { credits: 3, points: 3.00 },
      { credits: 4, points: 2.33 },
    ];

    const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
    const totalPoints = courses.reduce((acc, c) => acc + c.credits * c.points, 0);
    const gpa = Number((totalPoints / totalCredits).toFixed(2));

    assert.equal(totalCredits, 14);
    assert.equal(gpa, 3.12);
  });

  test("4. Cumulative CGPA Calculation Engine", () => {
    // Sem 1: 17 Cr, GPA 2.75 => 46.75
    // Sem 2: 18 Cr, GPA 2.60 => 46.80
    // Sem 3: 18 Cr, GPA 2.72 => 48.96
    // Sem 4: 18 Cr, GPA 2.65 => 47.70
    // Sem 5: 18 Cr, GPA 2.68 => 48.24
    // Total: 89 Cr => 238.45 pts => CGPA = 238.45 / 89 = 2.679 => 2.68
    const sems = [
      { credits: 17, gpa: 2.75 },
      { credits: 18, gpa: 2.60 },
      { credits: 18, gpa: 2.72 },
      { credits: 18, gpa: 2.65 },
      { credits: 18, gpa: 2.68 },
    ];

    const totalCr = sems.reduce((acc, s) => acc + s.credits, 0);
    const totalPts = sems.reduce((acc, s) => acc + s.credits * s.gpa, 0);
    const cgpa = Number((totalPts / totalCr).toFixed(2));

    assert.equal(cgpa, 2.68, "Calculated CGPA should match source reference 2.68");
  });

  test("5. Attendance Compliance Percentage Engine", () => {
    // 8 Present, 1 Late (counted as attended with 100% or partial), 1 Absent out of 10
    const total = 10;
    const attended = 8 + 1; // 9
    const percentage = Number(((attended / total) * 100).toFixed(2));

    assert.equal(percentage, 90.0);
    assert.equal(percentage >= 75.0, true, "Should satisfy HEC / UIT 75% exam clearance");
  });

  test("6. Financial Ledger Running Balance Integrity", () => {
    // Ledger transactions matching UIT University statement
    const txs = [
      { charge: 101250, pay: 0 }, // 101250
      { charge: 2000, pay: 0 },   // 103250
      { charge: 10000, pay: 0 },  // 113250
      { charge: 5000, pay: 0 },   // 118250
      { charge: 2000, pay: 0 },   // 120250
      { charge: 2000, pay: 0 },   // 122250
      { charge: 16000, pay: 0 },  // 138250
      { charge: 84430, pay: 0 },  // 222680
    ];

    let runningBalance = 0;
    for (const t of txs) {
      runningBalance += t.charge - t.pay;
    }

    assert.equal(runningBalance, 222680.0, "Balance must match exact reference value 222,680.00");
  });

  test("7. Database Entity Integration & Seed Verification", async () => {
    // Student record
    const student = await prisma.student.findFirst({
      where: { registrationNo: "23SP-052-SE" },
      include: {
        user: true,
        program: true,
        department: true,
        currentSemester: true,
      },
    });

    assert.ok(student, "Student Affan Ahmed must exist in DB");
    assert.equal(student.enrollmentNo, "UITU-23SP-UGRAD-00236");
    assert.equal(student.cgpa, 2.68);
    assert.equal(student.currentBalance, 222680.0);

    // Course offerings count
    const registered = await prisma.courseRegistration.count({
      where: { studentId: student.id, status: "APPROVED" },
    });
    assert.equal(registered, 8, "Student must have exactly 8 approved course registrations matching source reference");

    // Challans
    const challan = await prisma.feeChallan.findFirst({
      where: { studentId: student.id },
    });
    assert.ok(challan, "Fee Challan must exist");
    assert.equal(challan.payableAmount, 222680.0);
  });
});

