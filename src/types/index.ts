export type UserRole =
  | "SUPER_ADMIN"
  | "UNIVERSITY_ADMIN"
  | "REGISTRAR"
  | "FINANCE_OFFICER"
  | "EXAM_CONTROLLER"
  | "DEPT_HEAD"
  | "FACULTY"
  | "STUDENT";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string | null;
  cnic?: string | null;
}

export interface StudentProfile {
  id: string;
  userId: string;
  registrationNo: string;
  enrollmentNo: string;
  departmentId: string;
  programId: string;
  currentSemesterId: string;
  sectionId: string;
  admissionDate: string;
  academicStatus: string;
  currentBalance: number;
  loanAmount: number;
  cgpa: number;
  completedCredits: number;
  program?: {
    name: string;
    code: string;
    durationYears: number;
    totalCredits: number;
  };
  department?: {
    name: string;
    code: string;
  };
  currentSemester?: {
    name: string;
    code: string;
    academicSession: string;
  };
  section?: {
    name: string;
  };
}

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    registrationNo: string;
    enrollmentNo: string;
    section: string;
    department: string;
    program: string;
    currentSession: string;
    academicStatus: string;
    todayFormatted: string;
  };
  stats: {
    currentBalance: number;
    loanAmount: number;
    cgpa: number;
    registeredCourses: number;
    averageAttendance: number;
  };
  courses: Array<{
    id: string;
    code: string;
    title: string;
    instructor: string;
    room: string;
    timings: string;
    credits: number;
    attendanceRate: number;
  }>;
  activities: Array<{
    id: string;
    date: string;
    time: string;
    details: string;
    action: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  }>;
  todos: Array<{
    id: string;
    title: string;
    courseTitle?: string;
    completed: boolean;
    dueDate?: string;
  }>;
  surveys: Array<{
    id: string;
    courseName: string;
    title: string;
  }>;
  degreeCompletion: {
    percentage: number;
    completedCredits: number;
    totalCredits: number;
  };
  financialLedger: Array<{
    id: string;
    description: string;
    feeNature: string;
    session: string;
    date: string;
    charging: number;
    amount: number;
    currentBalance: number;
  }>;
}

export interface AttendanceRecordItem {
  id: string;
  date: string;
  topic: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks?: string | null;
  courseCode: string;
  courseTitle: string;
}

export interface ExamScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  seatNumber: string;
  paperType: string;
}

export interface UnofficialTranscriptSemester {
  semesterName: string;
  gpa: number;
  creditsAttempted: number;
  creditsEarned: number;
  courses: Array<{
    code: string;
    name: string;
    credits: number;
    gradeLetter: string;
    gpaPoint: number;
  }>;
}

export interface PLOItem {
  id: string;
  code: string;
  description: string;
  attainmentPercentage: number;
}

