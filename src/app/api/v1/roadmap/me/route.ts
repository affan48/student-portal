import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
      include: {
        program: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // 8 Semesters BS Software Engineering Curriculum Roadmap
    const curriculum = [
      {
        semesterNo: 1,
        title: "Semester 1",
        status: "COMPLETED",
        courses: [
          { code: "CS-101", title: "Introduction to ICT", credits: 3, status: "PASSED", grade: "B+" },
          { code: "CS-102", title: "Programming Fundamentals", credits: 4, status: "PASSED", grade: "B" },
          { code: "MT-101", title: "Calculus & Analytical Geometry", credits: 3, status: "PASSED", grade: "C+" },
          { code: "EN-101", title: "English Composition & Comprehension", credits: 3, status: "PASSED", grade: "A" },
          { code: "PH-101", title: "Applied Physics", credits: 4, status: "PASSED", grade: "C" },
        ],
      },
      {
        semesterNo: 2,
        title: "Semester 2",
        status: "COMPLETED",
        courses: [
          { code: "CS-201", title: "Object Oriented Programming", credits: 4, status: "PASSED", grade: "B" },
          { code: "CS-202", title: "Discrete Structures", credits: 3, status: "PASSED", grade: "C+" },
          { code: "MT-201", title: "Linear Algebra", credits: 3, status: "PASSED", grade: "C" },
          { code: "SE-201", title: "Introduction to Software Engineering", credits: 3, status: "PASSED", grade: "B+" },
          { code: "PK-101", title: "Pakistan Studies", credits: 2, status: "PASSED", grade: "A" },
          { code: "IS-101", title: "Islamic Studies / Ethics", credits: 3, status: "PASSED", grade: "B" },
        ],
      },
      {
        semesterNo: 3,
        title: "Semester 3",
        status: "COMPLETED",
        courses: [
          { code: "CS-301", title: "Data Structures & Algorithms", credits: 4, status: "PASSED", grade: "B-" },
          { code: "SE-301", title: "Software Requirements Engineering", credits: 3, status: "PASSED", grade: "B+" },
          { code: "CS-302", title: "Database Systems", credits: 4, status: "PASSED", grade: "B" },
          { code: "MT-301", title: "Probability & Statistics", credits: 3, status: "PASSED", grade: "C+" },
          { code: "EN-201", title: "Technical & Business Writing", credits: 3, status: "PASSED", grade: "B+" },
        ],
      },
      {
        semesterNo: 4,
        title: "Semester 4",
        status: "COMPLETED",
        courses: [
          { code: "CS-303", title: "Operating Systems", credits: 4, status: "PASSED", grade: "C+" },
          { code: "SE-303", title: "Software Design & Architecture", credits: 3, status: "PASSED", grade: "B" },
          { code: "CS-305", title: "Computer Networks", credits: 4, status: "PASSED", grade: "B" },
          { code: "SE-304", title: "Web Engineering", credits: 4, status: "PASSED", grade: "B+" },
          { code: "MG-101", title: "Engineering Economics", credits: 3, status: "PASSED", grade: "C" },
        ],
      },
      {
        semesterNo: 5,
        title: "Semester 5",
        status: "COMPLETED",
        courses: [
          { code: "SE-305", title: "Software Quality Engineering", credits: 3, status: "PASSED", grade: "B" },
          { code: "CS-310", title: "Artificial Intelligence", credits: 4, status: "PASSED", grade: "B-" },
          { code: "SE-308", title: "Software Project Management", credits: 3, status: "PASSED", grade: "B+" },
          { code: "SE-498", title: "Final Year Project - I", credits: 3, status: "PASSED", grade: "A-" },
          { code: "CS-320", title: "Information Security", credits: 3, status: "PASSED", grade: "C+" },
          { code: "SS-101", title: "Professional Ethics", credits: 2, status: "PASSED", grade: "A" },
        ],
      },
      {
        semesterNo: 6,
        title: "Semester 6 (Current Session - Fall 2026)",
        status: "IN_PROGRESS",
        courses: [
          { code: "SE-401", title: "Computing Professional Practices", credits: 3, status: "IN_PROGRESS", grade: "—" },
          { code: "SE-499", title: "Final Year Project - II", credits: 3, status: "IN_PROGRESS", grade: "—" },
          { code: "SE-412", title: "Information Systems Audit", credits: 3, status: "IN_PROGRESS", grade: "—" },
          { code: "CS-314", title: "Parallel and Distributed Computing", credits: 4, status: "IN_PROGRESS", grade: "—" },
          { code: "MG-201", title: "Principles of Accounting and Finance", credits: 3, status: "IN_PROGRESS", grade: "—" },
          { code: "SE-302", title: "Software Construction and Development", credits: 4, status: "IN_PROGRESS", grade: "—" },
          { code: "SE-405", title: "Software Re-Engineering", credits: 3, status: "IN_PROGRESS", grade: "—" },
          { code: "CS-415", title: "Mobile Application Development", credits: 3, status: "IN_PROGRESS", grade: "—" },
        ],
      },
      {
        semesterNo: 7,
        title: "Semester 7",
        status: "UPCOMING",
        courses: [
          { code: "SE-420", title: "Cloud Computing & DevOps", credits: 3, status: "PLANNED", grade: "—" },
          { code: "SE-422", title: "Software Metrics", credits: 3, status: "PLANNED", grade: "—" },
          { code: "SE-424", title: "Elective II - Enterprise Application Dev", credits: 3, status: "PLANNED", grade: "—" },
          { code: "MG-301", title: "Entrepreneurship", credits: 3, status: "PLANNED", grade: "—" },
        ],
      },
      {
        semesterNo: 8,
        title: "Semester 8",
        status: "UPCOMING",
        courses: [
          { code: "SE-430", title: "Elective III - Big Data Analytics", credits: 3, status: "PLANNED", grade: "—" },
          { code: "SE-432", title: "Elective IV - Cyber Security Operations", credits: 3, status: "PLANNED", grade: "—" },
          { code: "SE-450", title: "Industrial Internship", credits: 3, status: "PLANNED", grade: "—" },
        ],
      },
    ];

    return NextResponse.json({
      program: student.program.name,
      totalCredits: student.program.totalCredits,
      completedCredits: student.completedCredits,
      curriculum,
    });
  } catch (error: any) {
    console.error("Roadmap API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

