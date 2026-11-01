import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    const student = await prisma.student.findFirst({
      where: auth?.studentId ? { id: auth.studentId } : { registrationNo: "23SP-052-SE" },
      include: {
        user: true,
        program: true,
        department: true,
        currentSemester: true,
        section: true,
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const records = await prisma.studentAcademicRecord.findMany({
      where: { studentId: student.id },
      orderBy: { semesterName: "asc" },
    });

    // Detailed semester coursework
    const semesters = [
      {
        semesterName: "Spring 2023",
        gpa: 2.75,
        creditsAttempted: 17,
        creditsEarned: 17,
        courses: [
          { code: "CS-101", name: "Introduction to ICT", credits: 3, gradeLetter: "B+", gpaPoint: 3.33 },
          { code: "CS-102", name: "Programming Fundamentals", credits: 4, gradeLetter: "B", gpaPoint: 3.00 },
          { code: "MT-101", name: "Calculus & Analytical Geometry", credits: 3, gradeLetter: "C+", gpaPoint: 2.33 },
          { code: "EN-101", name: "English Composition & Comprehension", credits: 3, gradeLetter: "A", gpaPoint: 4.00 },
          { code: "PH-101", name: "Applied Physics", credits: 4, gradeLetter: "C", gpaPoint: 2.00 },
        ],
      },
      {
        semesterName: "Fall 2023",
        gpa: 2.60,
        creditsAttempted: 18,
        creditsEarned: 18,
        courses: [
          { code: "CS-201", name: "Object Oriented Programming", credits: 4, gradeLetter: "B", gpaPoint: 3.00 },
          { code: "CS-202", name: "Discrete Structures", credits: 3, gradeLetter: "C+", gpaPoint: 2.33 },
          { code: "MT-201", name: "Linear Algebra", credits: 3, gradeLetter: "C", gpaPoint: 2.00 },
          { code: "SE-201", name: "Introduction to Software Engineering", credits: 3, gradeLetter: "B+", gpaPoint: 3.33 },
          { code: "PK-101", name: "Pakistan Studies", credits: 2, gradeLetter: "A", gpaPoint: 4.00 },
          { code: "IS-101", name: "Islamic Studies / Ethics", credits: 3, gradeLetter: "B", gpaPoint: 3.00 },
        ],
      },
      {
        semesterName: "Spring 2024",
        gpa: 2.72,
        creditsAttempted: 18,
        creditsEarned: 18,
        courses: [
          { code: "CS-301", name: "Data Structures & Algorithms", credits: 4, gradeLetter: "B-", gpaPoint: 2.67 },
          { code: "SE-301", name: "Software Requirements Engineering", credits: 3, gradeLetter: "B+", gpaPoint: 3.33 },
          { code: "CS-302", name: "Database Systems", credits: 4, gradeLetter: "B", gpaPoint: 3.00 },
          { code: "MT-301", name: "Probability & Statistics", credits: 3, gradeLetter: "C+", gpaPoint: 2.33 },
          { code: "EN-201", name: "Technical & Business Writing", credits: 3, gradeLetter: "B+", gpaPoint: 3.33 },
        ],
      },
      {
        semesterName: "Fall 2024",
        gpa: 2.65,
        creditsAttempted: 18,
        creditsEarned: 18,
        courses: [
          { code: "CS-303", name: "Operating Systems", credits: 4, gradeLetter: "C+", gpaPoint: 2.33 },
          { code: "SE-303", name: "Software Design & Architecture", credits: 3, gradeLetter: "B", gpaPoint: 3.00 },
          { code: "CS-305", name: "Computer Networks", credits: 4, gradeLetter: "B", gpaPoint: 3.00 },
          { code: "SE-304", name: "Web Engineering", credits: 4, gradeLetter: "B+", gpaPoint: 3.33 },
          { code: "MG-101", name: "Engineering Economics", credits: 3, gradeLetter: "C", gpaPoint: 2.00 },
        ],
      },
      {
        semesterName: "Spring 2025",
        gpa: 2.68,
        creditsAttempted: 18,
        creditsEarned: 18,
        courses: [
          { code: "SE-305", name: "Software Quality Engineering", credits: 3, gradeLetter: "B", gpaPoint: 3.00 },
          { code: "CS-310", name: "Artificial Intelligence", credits: 4, gradeLetter: "B-", gpaPoint: 2.67 },
          { code: "SE-308", name: "Software Project Management", credits: 3, gradeLetter: "B+", gpaPoint: 3.33 },
          { code: "SE-498", name: "Final Year Project - I", credits: 3, gradeLetter: "A-", gpaPoint: 3.67 },
          { code: "CS-320", name: "Information Security", credits: 3, gradeLetter: "C+", gpaPoint: 2.33 },
          { code: "SS-101", name: "Professional Ethics", credits: 2, gradeLetter: "A", gpaPoint: 4.00 },
        ],
      },
    ];

    const totalAttempted = semesters.reduce((acc, s) => acc + s.creditsAttempted, 0);
    const totalEarned = semesters.reduce((acc, s) => acc + s.creditsEarned, 0);

    return NextResponse.json({
      transcript: {
        disclaimer: "UNOFFICIAL TRANSCRIPT - FOR STUDENT USE AND ADVISORY REFERENCE ONLY",
        student: {
          name: `${student.user.firstName} ${student.user.lastName}`,
          registrationNo: student.registrationNo,
          enrollmentNo: student.enrollmentNo,
          department: student.department.name,
          program: student.program.name,
          duration: `${student.program.durationYears} Years (8 Semesters)`,
          section: student.section.name,
          currentSession: student.currentSemester.name,
          cgpa: student.cgpa,
          academicStatus: student.academicStatus,
        },
        summary: {
          cgpa: student.cgpa,
          creditsAttempted: totalAttempted,
          creditsEarned: totalEarned,
          totalDegreeCredits: student.program.totalCredits,
          academicStanding: "Good Standing",
        },
        semesters,
        gradingScheme: [
          { grade: "A+", points: "4.00", marks: "85% and above" },
          { grade: "A", points: "3.67", marks: "80% - 84%" },
          { grade: "B+", points: "3.33", marks: "75% - 79%" },
          { grade: "B", points: "3.00", marks: "70% - 74%" },
          { grade: "C+", points: "2.33", marks: "65% - 69%" },
          { grade: "C", points: "2.00", marks: "60% - 64%" },
          { grade: "D", points: "1.00", marks: "50% - 59%" },
          { grade: "F", points: "0.00", marks: "Below 50%" },
        ],
      },
    });
  } catch (error: any) {
    console.error("Transcript API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

