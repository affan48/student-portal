import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed database for UIT University UMS / SIS...");

  // Clear existing records safely
  try {
    await prisma.loginActivity.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.todo.deleteMany();
    await prisma.surveyResponse.deleteMany();
    await prisma.surveyQuestion.deleteMany();
    await prisma.survey.deleteMany();
    await prisma.workflowApproval.deleteMany();
    await prisma.workflow.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.feeChallan.deleteMany();
    await prisma.financialLedger.deleteMany();
    await prisma.financialAdjustment.deleteMany();
    await prisma.studentAdvance.deleteMany();
    await prisma.admitCard.deleteMany();
    await prisma.examSeat.deleteMany();
    await prisma.examRoom.deleteMany();
    await prisma.examinationSchedule.deleteMany();
    await prisma.examination.deleteMany();
    await prisma.examAnswer.deleteMany();
    await prisma.examAttempt.deleteMany();
    await prisma.examOption.deleteMany();
    await prisma.examQuestion.deleteMany();
    await prisma.onlineExam.deleteMany();
    await prisma.assessmentResult.deleteMany();
    await prisma.assessment.deleteMany();
    await prisma.grade.deleteMany();
    await prisma.attendanceRecord.deleteMany();
    await prisma.attendanceSession.deleteMany();
    await prisma.timetable.deleteMany();
    await prisma.courseMaterial.deleteMany();
    await prisma.courseRegistration.deleteMany();
    await prisma.courseOffering.deleteMany();
    await prisma.coursePLOMapping.deleteMany();
    await prisma.pLOAttainment.deleteMany();
    await prisma.programLearningOutcome.deleteMany();
    await prisma.coursePrerequisite.deleteMany();
    await prisma.course.deleteMany();
    await prisma.studentAcademicRecord.deleteMany();
    await prisma.student.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.section.deleteMany();
    await prisma.semester.deleteMany();
    await prisma.program.deleteMany();
    await prisma.department.deleteMany();
    await prisma.classroom.deleteMany();
    await prisma.campus.deleteMany();
    await prisma.university.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.userAccessibilitySetting.deleteMany();
    await prisma.user.deleteMany();
  } catch (err) {
    console.log("Initial cleanup note:", err.message);
  }

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. University & Campus
  const university = await prisma.university.create({
    data: {
      name: "UIT University",
      code: "UITU",
      address: "Deh Dih, University Road, Scheme-33, Gulshan-e-Iqbal, Karachi",
      website: "https://uit.edu.pk",
      logoUrl: "/images/uit-logo.png",
    },
  });

  const campus = await prisma.campus.create({
    data: {
      universityId: university.id,
      name: "Main Campus",
      code: "MAIN",
      city: "Karachi",
    },
  });

  // 2. Classrooms
  const roomQuiet = await prisma.classroom.create({
    data: {
      campusId: campus.id,
      roomNumber: "QR-1",
      name: "Quiet Room",
      capacity: 60,
      roomType: "LECTURE_HALL",
    },
  });

  const roomAuditorium = await prisma.classroom.create({
    data: {
      campusId: campus.id,
      roomNumber: "AUD-1",
      name: "Auditorium",
      capacity: 250,
      roomType: "AUDITORIUM",
    },
  });

  const roomR201 = await prisma.classroom.create({
    data: {
      campusId: campus.id,
      roomNumber: "R-201",
      name: "R-201",
      capacity: 50,
      roomType: "LECTURE_HALL",
    },
  });

  const roomCompLab2 = await prisma.classroom.create({
    data: {
      campusId: campus.id,
      roomNumber: "CL-2",
      name: "COMPUTING LAB-II",
      capacity: 45,
      roomType: "LAB",
    },
  });

  const roomCommSysLab = await prisma.classroom.create({
    data: {
      campusId: campus.id,
      roomNumber: "CS-LAB",
      name: "Communication System Lab",
      capacity: 45,
      roomType: "LAB",
    },
  });

  // 3. Department & Program
  const departmentCS = await prisma.department.create({
    data: {
      campusId: campus.id,
      name: "Department of Computer Science & Software Engineering",
      code: "CSSE",
      headOfDept: "Dr. Tariq Rahim",
    },
  });

  const programSE = await prisma.program.create({
    data: {
      departmentId: departmentCS.id,
      name: "BS Software Engineering",
      code: "BSSE",
      degreeLevel: "UNDERGRADUATE",
      durationYears: 4,
      totalCredits: 134,
    },
  });

  // 4. Semesters
  const semesterSpring23 = await prisma.semester.create({
    data: {
      name: "Spring 2023",
      code: "23SP",
      academicSession: "2022-2023",
      startDate: new Date("2023-01-15"),
      endDate: new Date("2023-06-15"),
      isCurrent: false,
      registrationOpen: false,
    },
  });

  const semesterFall26 = await prisma.semester.create({
    data: {
      name: "Fall 2026",
      code: "26FL",
      academicSession: "2026-2027",
      startDate: new Date("2026-08-15"),
      endDate: new Date("2026-12-30"),
      isCurrent: true,
      registrationOpen: true,
    },
  });

  // Section A
  const sectionA = await prisma.section.create({
    data: {
      programId: programSE.id,
      semesterId: semesterFall26.id,
      name: "A",
    },
  });

  // 5. Users: Admin, Registrar, Finance, Faculty members, Student
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@uit.edu",
      passwordHash: hashedPassword,
      role: "SUPER_ADMIN",
      firstName: "Super",
      lastName: "Administrator",
      phone: "+92-300-1112233",
    },
  });

  const registrarUser = await prisma.user.create({
    data: {
      email: "registrar@uit.edu",
      passwordHash: hashedPassword,
      role: "REGISTRAR",
      firstName: "Academic",
      lastName: "Registrar",
      phone: "+92-300-2223344",
    },
  });

  const financeUser = await prisma.user.create({
    data: {
      email: "finance@uit.edu",
      passwordHash: hashedPassword,
      role: "FINANCE_OFFICER",
      firstName: "Finance",
      lastName: "Officer",
      phone: "+92-300-3334455",
    },
  });

  // Faculty Users
  const facultyData = [
    { name: "Muhammad Waqas Pasha", email: "waqas.pasha@uit.edu", desig: "Assistant Professor", room: roomQuiet },
    { name: "Jawad Ahmed Bhutta", email: "jawad.bhutta@uit.edu", desig: "Senior Lecturer", room: roomR201 },
    { name: "Shaukat Wasi", email: "shaukat.wasi@uit.edu", desig: "Associate Professor", room: roomCompLab2 },
    { name: "Ismail Abbasi", email: "ismail.abbasi@uit.edu", desig: "Assistant Professor", room: roomQuiet },
    { name: "Talha Ahmed", email: "talha.ahmed@uit.edu", desig: "Lecturer", room: roomCommSysLab },
  ];

  const facultyRecords = [];
  for (const f of facultyData) {
    const parts = f.name.split(" ");
    const user = await prisma.user.create({
      data: {
        email: f.email,
        passwordHash: hashedPassword,
        role: "FACULTY",
        firstName: parts[0],
        lastName: parts.slice(1).join(" ") || "Faculty",
      },
    });
    const profile = await prisma.faculty.create({
      data: {
        userId: user.id,
        departmentId: departmentCS.id,
        designation: f.desig,
      },
    });
    facultyRecords.push({ ...f, profile, user });
  }

  // Generic faculty login
  await prisma.user.create({
    data: {
      email: "faculty@uit.edu",
      passwordHash: hashedPassword,
      role: "FACULTY",
      firstName: "University",
      lastName: "Faculty",
      facultyProfile: {
        create: {
          departmentId: departmentCS.id,
          designation: "Assistant Professor",
        },
      },
    },
  });

  // Student User (Muhammad Affan Ahmed)
  const studentUser = await prisma.user.create({
    data: {
      email: "student@uit.edu",
      passwordHash: hashedPassword,
      role: "STUDENT",
      firstName: "Muhammad Affan",
      lastName: "Ahmed",
      phone: "+92-300-1234567",
      cnic: "42101-1234567-1",
      accessibility: {
        create: {
          fontSize: "default",
          highContrast: false,
          darkMode: false,
          reduceMotion: false,
        },
      },
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      registrationNo: "23SP-052-SE",
      enrollmentNo: "UITU-23SP-UGRAD-00236",
      departmentId: departmentCS.id,
      programId: programSE.id,
      currentSemesterId: semesterFall26.id,
      sectionId: sectionA.id,
      admissionDate: new Date("2023-01-10"),
      academicStatus: "Active",
      currentBalance: 222680.0,
      loanAmount: 0.0,
      cgpa: 2.68,
      completedCredits: 96,
    },
  });

  // 6. Courses & Course Offerings
  const coursesData = [
    {
      code: "SE-401",
      name: "Computing Professional Practices",
      credits: 3,
      instructor: facultyRecords[0],
      room: roomQuiet,
      timing: "Sat 14:30 - 15:25 Sat 15:30 - 16:25 Sat 16:30 - 17:25",
      day: "Saturday",
      start: "14:30",
      end: "17:25",
    },
    {
      code: "SE-499",
      name: "Final Year Project - II",
      credits: 3,
      instructor: facultyRecords[0],
      room: roomAuditorium,
      timing: "Sun 08:30 - 09:25",
      day: "Sunday",
      start: "08:30",
      end: "09:25",
    },
    {
      code: "SE-412",
      name: "Information Systems Audit",
      credits: 3,
      instructor: facultyRecords[1],
      room: roomR201,
      timing: "Tue 10:30 - 11:25 Tue 11:30 - 12:25 Tue 12:30 - 13:25",
      day: "Tuesday",
      start: "10:30",
      end: "13:25",
    },
    {
      code: "CS-314",
      name: "Parallel and Distributed Computing",
      credits: 4,
      instructor: facultyRecords[2],
      room: roomCompLab2,
      timing: "Sat 08:30 - 09:25 Sat 09:30 - 10:25 Sat 10:30 - 11:25",
      day: "Saturday",
      start: "08:30",
      end: "11:25",
    },
    {
      code: "MG-201",
      name: "Principles of Accounting and Finance",
      credits: 3,
      instructor: facultyRecords[3],
      room: roomQuiet,
      timing: "Thu 11:30 - 12:25 Thu 12:30 - 13:25 Thu 13:30 - 14:25",
      day: "Thursday",
      start: "11:30",
      end: "14:25",
    },
    {
      code: "SE-302",
      name: "Software Construction and Development",
      credits: 4,
      instructor: facultyRecords[4],
      room: roomCommSysLab,
      timing: "Mon 14:30 - 17:25",
      day: "Monday",
      start: "14:30",
      end: "17:25",
    },
    {
      code: "SE-405",
      name: "Software Re-Engineering",
      credits: 3,
      instructor: facultyRecords[4],
      room: roomR201,
      timing: "Wed 10:30 - 13:25",
      day: "Wednesday",
      start: "10:30",
      end: "13:25",
    },
    {
      code: "CS-415",
      name: "Mobile Application Development",
      credits: 3,
      instructor: facultyRecords[1],
      room: roomCompLab2,
      timing: "Fri 09:00 - 12:00",
      day: "Friday",
      start: "09:00",
      end: "12:00",
    },
  ];

  const createdOfferings = [];
  for (const c of coursesData) {
    const course = await prisma.course.create({
      data: {
        departmentId: departmentCS.id,
        code: c.code,
        name: c.name,
        creditHours: c.credits,
        lectureHours: 3,
        labHours: c.credits > 3 ? 1 : 0,
      },
    });

    const offering = await prisma.courseOffering.create({
      data: {
        courseId: course.id,
        semesterId: semesterFall26.id,
        sectionId: sectionA.id,
        facultyId: c.instructor.profile.id,
        classroomId: c.room.id,
        timingsSummary: c.timing,
      },
    });

    // Timetable entry
    await prisma.timetable.create({
      data: {
        courseOfferingId: offering.id,
        dayOfWeek: c.day,
        startTime: c.start,
        endTime: c.end,
        classroomId: c.room.id,
      },
    });

    // Register student to all 8 courses (matching source screenshot: Registered Courses = 8.00)
    await prisma.courseRegistration.create({
      data: {
        studentId: student.id,
        courseOfferingId: offering.id,
        status: "APPROVED",
      },
    });

    // Create 10 attendance sessions per course with realistic attendance (avg ~83.43%)
    for (let i = 1; i <= 10; i++) {
      const sessionDate = new Date(`2026-09-${i < 10 ? "0" + i : i}T10:00:00Z`);
      const attSession = await prisma.attendanceSession.create({
        data: {
          courseOfferingId: offering.id,
          date: sessionDate,
          topic: `Lecture ${i}: Course core competencies and practical implementations`,
        },
      });

      // Attendance status: 8 Present, 1 Late, 1 Absent => ~85% attendance
      const status = i === 4 ? "ABSENT" : i === 7 ? "LATE" : "PRESENT";
      await prisma.attendanceRecord.create({
        data: {
          sessionId: attSession.id,
          studentId: student.id,
          status: status,
          remarks: status === "LATE" ? "Arrived 10 mins late" : null,
        },
      });
    }

    // Assessments & Results
    const midterm = await prisma.assessment.create({
      data: {
        courseOfferingId: offering.id,
        title: "Midterm Examination",
        assessmentType: "MIDTERM",
        totalMarks: 30,
        weightage: 30,
      },
    });

    await prisma.assessmentResult.create({
      data: {
        assessmentId: midterm.id,
        studentId: student.id,
        obtainedMarks: 24.5,
        remarks: "Good comprehension",
      },
    });

    const assignment = await prisma.assessment.create({
      data: {
        courseOfferingId: offering.id,
        title: "Assignment 1 - Implementation",
        assessmentType: "ASSIGNMENT",
        totalMarks: 10,
        weightage: 10,
      },
    });

    await prisma.assessmentResult.create({
      data: {
        assessmentId: assignment.id,
        studentId: student.id,
        obtainedMarks: 8.5,
      },
    });

    createdOfferings.push({ course, offering, c });
  }

  // 7. Financial Ledger (Exact rows from reference screenshot!)
  const ledgerEntries = [
    { desc: "Fee structure", nature: "Tuition Fee", session: "Spring 2023", date: "2023-03-03", charging: 101250, amount: 0, balance: 101250 },
    { desc: "Fee structure", nature: "Semester Charges", session: "Spring 2023", date: "2023-03-03", charging: 2000, amount: 0, balance: 103250 },
    { desc: "Fee structure", nature: "Security Deposit", session: "Spring 2023", date: "2023-03-03", charging: 10000, amount: 0, balance: 113250 },
    { desc: "Fee structure", nature: "Examination Fee", session: "Spring 2023", date: "2023-03-03", charging: 5000, amount: 0, balance: 118250 },
    { desc: "Fee structure", nature: "Enrollment Fee", session: "Spring 2023", date: "2023-03-03", charging: 2000, amount: 0, balance: 120250 },
    { desc: "Fee structure", nature: "Documents Verification Fee", session: "Spring 2023", date: "2023-03-03", charging: 2000, amount: 0, balance: 122250 },
    { desc: "Fee structure", nature: "Admission Fee", session: "Spring 2023", date: "2023-03-03", charging: 16000, amount: 0, balance: 138250 },
    // Continuation of ledger up to current balance PKR 222,680.00
    { desc: "Fee structure", nature: "Fall 2026 Tuition Fee", session: "Fall 2026", date: "2026-08-15", charging: 84430, amount: 0, balance: 222680 },
  ];

  for (const item of ledgerEntries) {
    await prisma.financialLedger.create({
      data: {
        studentId: student.id,
        description: item.desc,
        feeNature: item.nature,
        session: item.session,
        transactionDate: new Date(item.date),
        charging: item.charging,
        amount: item.amount,
        currentBalance: item.balance,
        transactionType: "CHARGE",
      },
    });
  }

  // Fee Challan for Fall 2026
  const challan = await prisma.feeChallan.create({
    data: {
      studentId: student.id,
      semesterId: semesterFall26.id,
      challanNumber: "CHL-2026-FL-00982",
      issueDate: new Date("2026-08-15"),
      dueDate: new Date("2026-11-20"),
      totalAmount: 222680.0,
      payableAmount: 222680.0,
      status: "PENDING",
      bankDetails: "Habib Bank Limited (HBL) - A/C: 00427900123403 | UIT University Collection",
    },
  });

  // 8. Login Activities (matching reference screenshot)
  const activities = [
    { action: "LOGIN", date: "2026-11-02T02:53:00Z", details: "Student Logged In" },
    { action: "LOGIN", date: "2026-10-29T06:53:00Z", details: "Student Logged In" },
    { action: "LOGOUT", date: "2026-10-29T12:26:00Z", details: "Student Logged Out" },
    { action: "LOGIN", date: "2026-10-29T12:22:00Z", details: "Student Logged In" },
    { action: "LOGOUT", date: "2026-10-23T11:01:00Z", details: "Student Logged Out" },
    { action: "LOGIN", date: "2026-10-23T11:00:00Z", details: "Student Logged In" },
    { action: "LOGIN", date: "2026-10-19T04:32:00Z", details: "Student Logged In" },
    { action: "LOGOUT", date: "2026-10-17T10:20:00Z", details: "Student Logged Out" },
  ];

  for (const a of activities) {
    await prisma.loginActivity.create({
      data: {
        userId: studentUser.id,
        action: a.action,
        details: a.details,
        createdAt: new Date(a.date),
      },
    });
  }

  // 9. Announcements (matching reference screenshot)
  await prisma.announcement.create({
    data: {
      title: "ANNOUNCEMENT – FALL 2026 COURSE REGISTRATION",
      content: `Dear Students,
All students are advised to thoroughly review the courses appearing on their EDU Portal for Fall 2026 and ensure that the courses listed are correct and in accordance with the approved curriculum and semester requirements.

Students are particularly advised to carefully verify their elective/major courses.

Students from a Pre-Medical background are specifically requested to verify that their Foundation Mathematics-I (FM-I) and Foundation Mathematics-II (FM-II) courses are correctly reflected in the EDU Portal.

In case of any discrepancy, missing course, or incorrectly registered course, students are requested to report the matter immediately to the Academic Coordination office.`,
      priority: "HIGH",
      publishedAt: new Date("2026-10-05T12:00:00Z"),
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Faculty Evaluation Survey - Fall 2026",
      content: "All students must complete mandatory faculty evaluations before the upcoming midterm examination admit cards can be printed.",
      priority: "NORMAL",
      publishedAt: new Date("2026-10-15T09:00:00Z"),
      isPinned: false,
    },
  });

  // 10. Todo List (matching reference screenshot)
  const todoItems = [
    { title: "Teacher Evaluation", course: "Software Construction and Development", cat: "EVALUATION" },
    { title: "Teacher Evaluation", course: "Software Re-Engineering", cat: "EVALUATION" },
    { title: "Teacher Evaluation", course: "Information Systems Audit", cat: "EVALUATION" },
    { title: "Teacher Evaluation", course: "Principles of Accounting and Finance", cat: "EVALUATION" },
    { title: "Submit Final Year Project - II Progress Report", course: "Final Year Project - II", cat: "ACADEMIC" },
    { title: "Lab Assignment 3 submission", course: "Parallel and Distributed Computing", cat: "ACADEMIC" },
  ];

  for (const t of todoItems) {
    await prisma.todo.create({
      data: {
        studentId: student.id,
        title: t.title,
        courseTitle: t.course,
        category: t.cat,
        dueDate: new Date("2026-11-15T23:59:59Z"),
      },
    });
  }

  // 11. Feedbacks / Surveys
  for (const co of createdOfferings.slice(0, 4)) {
    const s = await prisma.survey.create({
      data: {
        title: `Teacher Evaluation - ${co.course.name}`,
        description: `Feedback and quality assurance survey for ${co.course.name} conducted by ${co.c.instructor.name}`,
        courseOfferingId: co.offering.id,
        semesterId: semesterFall26.id,
        dueDate: new Date("2026-11-20T23:59:59Z"),
        isActive: true,
      },
    });

    await prisma.surveyQuestion.createMany({
      data: [
        { surveyId: s.id, questionText: "The instructor demonstrates deep knowledge and command over subject matter.", questionType: "RATING", orderIndex: 1 },
        { surveyId: s.id, questionText: "The instructor is punctual and maintains a collaborative learning atmosphere.", questionType: "RATING", orderIndex: 2 },
        { surveyId: s.id, questionText: "The course assessments are well-aligned with stated learning outcomes.", questionType: "RATING", orderIndex: 3 },
      ],
    });
  }

  // 12. Examination & Seating Plan
  const exam = await prisma.examination.create({
    data: {
      semesterId: semesterFall26.id,
      examType: "MIDTERM",
      title: "Fall 2026 Midterm Examinations",
      startDate: new Date("2026-11-10"),
      endDate: new Date("2026-11-25"),
      isPublished: true,
    },
  });

  const examSched1 = await prisma.examinationSchedule.create({
    data: {
      examinationId: exam.id,
      courseOfferingId: createdOfferings[0].offering.id,
      examDate: new Date("2026-11-12T09:00:00Z"),
      startTime: "09:00",
      endTime: "11:00",
      paperType: "THEORY",
    },
  });

  await prisma.examSeat.create({
    data: {
      scheduleId: examSched1.id,
      studentId: student.id,
      roomNumber: "R-201",
      seatNumber: "A-14",
    },
  });

  await prisma.admitCard.create({
    data: {
      studentId: student.id,
      examinationId: exam.id,
      challanVerified: true,
      barcode: "UITU-EXAM-23SP-052-SE-FL26",
    },
  });

  // 13. Online Exam Sample
  const onlineExam = await prisma.onlineExam.create({
    data: {
      courseOfferingId: createdOfferings[5].offering.id, // Software Construction
      title: "Software Construction & Architecture Quiz 1",
      instructions: "Attempt all questions. Server-side auto-save is enabled every 10 seconds. Time allowed: 30 minutes.",
      durationMinutes: 30,
      totalMarks: 20,
      startsAt: new Date("2026-11-01T00:00:00Z"),
      endsAt: new Date("2026-11-30T23:59:59Z"),
      isActive: true,
    },
  });

  const q1 = await prisma.examQuestion.create({
    data: {
      onlineExamId: onlineExam.id,
      questionText: "Which software design principle states that software entities should be open for extension but closed for modification?",
      questionType: "MCQ",
      marks: 5,
      orderIndex: 1,
    },
  });

  await prisma.examOption.createMany({
    data: [
      { questionId: q1.id, optionText: "Single Responsibility Principle", isCorrect: false },
      { questionId: q1.id, optionText: "Open/Closed Principle (OCP)", isCorrect: true },
      { questionId: q1.id, optionText: "Liskov Substitution Principle", isCorrect: false },
      { questionId: q1.id, optionText: "Interface Segregation Principle", isCorrect: false },
    ],
  });

  const q2 = await prisma.examQuestion.create({
    data: {
      onlineExamId: onlineExam.id,
      questionText: "In TypeScript and modern JavaScript, which operator provides a safe way to access nested properties without causing a TypeError if an intermediate value is null or undefined?",
      questionType: "MCQ",
      marks: 5,
      orderIndex: 2,
    },
  });

  await prisma.examOption.createMany({
    data: [
      { questionId: q2.id, optionText: "Nullish Coalescing (??)", isCorrect: false },
      { questionId: q2.id, optionText: "Optional Chaining (?.)", isCorrect: true },
      { questionId: q2.id, optionText: "Ternary Operator (?:)", isCorrect: false },
      { questionId: q2.id, optionText: "Logical OR (||)", isCorrect: false },
    ],
  });

  // 14. Academic Records & GPA History
  const semHistory = [
    { name: "Spring 2023", gpa: 2.75, attempted: 17, earned: 17, standing: "Good Standing" },
    { name: "Fall 2023", gpa: 2.60, attempted: 18, earned: 18, standing: "Good Standing" },
    { name: "Spring 2024", gpa: 2.72, attempted: 18, earned: 18, standing: "Good Standing" },
    { name: "Fall 2024", gpa: 2.65, attempted: 18, earned: 18, standing: "Good Standing" },
    { name: "Spring 2025", gpa: 2.68, attempted: 18, earned: 18, standing: "Good Standing" },
  ];

  for (const s of semHistory) {
    await prisma.studentAcademicRecord.create({
      data: {
        studentId: student.id,
        semesterId: semesterSpring23.id,
        semesterName: s.name,
        gpa: s.gpa,
        creditsAttempted: s.attempted,
        creditsEarned: s.earned,
        academicStanding: s.standing,
      },
    });
  }

  // 15. PLO Attainment
  const plos = [
    { code: "PLO-1: Engineering Knowledge", desc: "An ability to apply knowledge of mathematics, science, engineering fundamentals and an engineering specialization to the solution of complex engineering problems.", val: 82.5 },
    { code: "PLO-2: Problem Analysis", desc: "An ability to identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions.", val: 78.0 },
    { code: "PLO-3: Design/Development of Solutions", desc: "An ability to design solutions for complex engineering problems and design systems, components or processes.", val: 84.2 },
    { code: "PLO-4: Modern Tool Usage", desc: "An ability to create, select and apply appropriate techniques, resources, and modern engineering and IT tools.", val: 89.0 },
    { code: "PLO-5: Individual and Teamwork", desc: "An ability to function effectively as an individual, and as a member or leader in diverse teams and in multidisciplinary settings.", val: 91.0 },
    { code: "PLO-6: Ethics", desc: "Apply ethical principles and commit to professional ethics and responsibilities and norms of engineering practice.", val: 95.0 },
  ];

  for (const p of plos) {
    const ploRec = await prisma.programLearningOutcome.create({
      data: {
        programId: programSE.id,
        code: p.code,
        description: p.desc,
      },
    });

    await prisma.pLOAttainment.create({
      data: {
        studentId: student.id,
        ploId: ploRec.id,
        attainmentPercentage: p.val,
      },
    });
  }

  // 16. Workflows
  const wf = await prisma.workflow.create({
    data: {
      studentId: student.id,
      requestType: "FEE_INSTALLMENT",
      title: "Request for Fall 2026 Fee Installment Plan",
      description: "Requesting approval to pay the current tuition balance in two equal installments.",
      status: "APPROVED",
      currentApproverRole: "FINANCE_OFFICER",
    },
  });

  await prisma.workflowApproval.create({
    data: {
      workflowId: wf.id,
      approverId: financeUser.id,
      approverRole: "FINANCE_OFFICER",
      status: "APPROVED",
      comments: "Installment plan granted for Fall 2026. First half due Nov 20, 2026.",
    },
  });

  // 17. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        title: "Fall 2026 Midterm Schedule Published",
        message: "The examination schedule and seating plan for Fall 2026 have been published. Please verify your admit card.",
        link: "/exams",
      },
      {
        userId: studentUser.id,
        title: "Fee Challan Available",
        message: "Your Fall 2026 fee challan has been generated and is ready for payment.",
        link: "/fees",
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("Default credentials:");
  console.log(" - Student: student@uit.edu / Password123! (Affan Ahmed, 23SP-052-SE)");
  console.log(" - Faculty: faculty@uit.edu / Password123!");
  console.log(" - Admin: admin@uit.edu / Password123!");
  console.log(" - Registrar: registrar@uit.edu / Password123!");
  console.log(" - Finance: finance@uit.edu / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

