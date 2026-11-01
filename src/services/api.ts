// API Client Service layer
const BASE_URL = "/api/v1";

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ums_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function handleResponse<T = any>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const apiService = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password?: string }) =>
      fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }).then(handleResponse),

    me: () =>
      fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),
  },

  // Dashboard
  dashboard: {
    getStudentDashboard: () =>
      fetch(`${BASE_URL}/dashboard/student`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getAdminDashboard: () =>
      fetch(`${BASE_URL}/dashboard/admin`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Courses
  courses: {
    getMyCourses: () =>
      fetch(`${BASE_URL}/students/me/courses`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Attendance
  attendance: {
    getMyAttendance: () =>
      fetch(`${BASE_URL}/students/me/attendance`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Examinations
  exams: {
    getSchedule: () =>
      fetch(`${BASE_URL}/students/me/exams`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getSeatingPlan: () =>
      fetch(`${BASE_URL}/students/me/seating-plan`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getAdmitCard: (examId?: string) =>
      fetch(`${BASE_URL}/students/me/admit-card${examId ? `?examId=${examId}` : ""}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getTranscript: () =>
      fetch(`${BASE_URL}/students/me/transcript`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getOnlineExam: () =>
      fetch(`${BASE_URL}/students/me/online-exam`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    saveOnlineExamAnswer: (attemptId: string, questionId: string, selectedOptionId: string) =>
      fetch(`${BASE_URL}/students/me/online-exam/save-answer`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ attemptId, questionId, selectedOptionId }),
      }).then(handleResponse),

    submitOnlineExam: (attemptId: string) =>
      fetch(`${BASE_URL}/students/me/online-exam/submit`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ attemptId }),
      }).then(handleResponse),
  },

  // Finance
  finance: {
    getLedger: () =>
      fetch(`${BASE_URL}/finance/ledger/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getChallans: () =>
      fetch(`${BASE_URL}/finance/challans/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    payChallan: (challanId: string, paymentMethod: string, reference: string) =>
      fetch(`${BASE_URL}/finance/pay`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ challanId, paymentMethod, reference }),
      }).then(handleResponse),
  },

  // Registration & Timetable
  academic: {
    getTimetable: () =>
      fetch(`${BASE_URL}/timetable/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getRoadmap: () =>
      fetch(`${BASE_URL}/roadmap/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getPLO: () =>
      fetch(`${BASE_URL}/plo/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getRegistrationStatus: () =>
      fetch(`${BASE_URL}/registration/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    registerCourses: (courseOfferingIds: string[]) =>
      fetch(`${BASE_URL}/registration/me`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ courseOfferingIds }),
      }).then(handleResponse),
  },

  // General & Surveys & Workflows
  general: {
    getAnnouncements: () =>
      fetch(`${BASE_URL}/announcements`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getTodos: () =>
      fetch(`${BASE_URL}/todos`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    toggleTodo: (id: string, completed: boolean) =>
      fetch(`${BASE_URL}/todos`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id, completed }),
      }).then(handleResponse),

    getSurveys: () =>
      fetch(`${BASE_URL}/surveys`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    submitSurvey: (surveyId: string, answers: Record<string, any>) =>
      fetch(`${BASE_URL}/surveys`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ surveyId, answers }),
      }).then(handleResponse),

    getWorkflows: () =>
      fetch(`${BASE_URL}/workflow/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    submitWorkflow: (data: { requestType: string; title: string; description: string }) =>
      fetch(`${BASE_URL}/workflow/me`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    getCommunication: () =>
      fetch(`${BASE_URL}/communication`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    sendMessage: (data: { recipientEmail: string; subject: string; body: string }) =>
      fetch(`${BASE_URL}/communication`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),
  },

  // Faculty APIs
  faculty: {
    getMyCourses: () =>
      fetch(`${BASE_URL}/faculty/courses`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getCourseStudents: (offeringId: string) =>
      fetch(`${BASE_URL}/faculty/students?offeringId=${offeringId}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    markAttendance: (data: { offeringId: string; date: string; topic: string; records: Array<{ studentId: string; status: string; remarks?: string }> }) =>
      fetch(`${BASE_URL}/faculty/attendance`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    submitMarks: (data: { assessmentId: string; results: Array<{ studentId: string; obtainedMarks: number; remarks?: string }> }) =>
      fetch(`${BASE_URL}/faculty/assessments/marks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),
  },

  // Admin APIs
  admin: {
    getStudents: (page: number = 1, search: string = "") =>
      fetch(`${BASE_URL}/admin/students?page=${page}&search=${encodeURIComponent(search)}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    createStudent: (studentData: any) =>
      fetch(`${BASE_URL}/admin/students`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(studentData),
      }).then(handleResponse),

    getFacultyList: () =>
      fetch(`${BASE_URL}/admin/faculty`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getCoursesList: () =>
      fetch(`${BASE_URL}/admin/courses`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getDepartmentsList: () =>
      fetch(`${BASE_URL}/admin/departments`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),

    getReports: () =>
      fetch(`${BASE_URL}/admin/reports`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },
};
