# REST API Reference Manual

Base URL: `/api/v1`

## 1. Authentication
- `POST /api/v1/auth/login` — Login with email and password. Returns JWT access token, refresh token, user record, and student/faculty profile.
- `GET /api/v1/auth/me` — Returns authenticated user profile, accessibility preferences, and role context.
- `POST /api/v1/auth/logout` — Invalidates session and logs logout activity.
- `POST /api/v1/auth/change-password` — Validates current password and sets new password hash.

## 2. Dashboard
- `GET /api/v1/dashboard/student` — Complete student dashboard data (Identification bar, My Stats cards, Courses list, Overview, Activities, Announcements, Todos, Surveys, Degree completion, Financial ledger).
- `GET /api/v1/dashboard/admin` — University-wide counts, fee collections, outstanding dues, department summaries.

## 3. Academic & Courses
- `GET /api/v1/students/me/courses` — Enrolled courses with instructors, rooms, timings, assessments, and syllabus outlines.
- `GET /api/v1/students/me/attendance` — Complete lecture attendance log with compliance rates.
- `GET /api/v1/timetable/me` — Weekly lecture schedule.
- `GET /api/v1/registration/me` — Available and enrolled courses for current semester.
- `POST /api/v1/registration/me` — Register for selected course offerings (validates 21 credit limit).
- `GET /api/v1/roadmap/me` — 8-semester degree roadmap.
- `GET /api/v1/plo/me` — Program Learning Outcome attainment vs 60% benchmark.

## 4. Examinations
- `GET /api/v1/students/me/exams` — Examination dates, timings, venues, and seat numbers.
- `GET /api/v1/students/me/seating-plan` — Exam hall allocations and reporting regulations.
- `GET /api/v1/students/me/admit-card` — Official admit card details with barcode and clearance status.
- `GET /api/v1/students/me/transcript` — Unofficial transcript with semester-by-semester GPA and CGPA.
- `GET /api/v1/students/me/online-exam` — Active online examination questions, remaining time, and attempt.
- `POST /api/v1/students/me/online-exam/save-answer` — Autosave individual question response.
- `POST /api/v1/students/me/online-exam/submit` — Final exam submission with automatic server-side scoring.

## 5. Finance
- `GET /api/v1/finance/ledger/me` — Financial ledger entries with charging, payments, and running balance.
- `GET /api/v1/finance/challans/me` — Semester fee challans and payment status.
- `POST /api/v1/finance/pay` — Record verified bank/online fee payment and update ledger.

## 6. General & Communication
- `GET /api/v1/announcements` — University announcements.
- `GET /api/v1/todos` — Academic todos.
- `PATCH /api/v1/todos` — Toggle todo completion.
- `GET /api/v1/surveys` — Faculty evaluation questionnaires.
- `POST /api/v1/surveys` — Submit anonymous evaluation responses.
- `GET /api/v1/workflow/me` — Student workflow requests.
- `POST /api/v1/workflow/me` — Submit academic workflow request.
- `GET /api/v1/communication` — Inbox messages.
- `POST /api/v1/communication` — Send message to faculty/staff.

## 7. Faculty & Administration
- `GET /api/v1/faculty/courses` — Assigned courses and student rosters.
- `POST /api/v1/faculty/attendance` — Record attendance for course session.
- `POST /api/v1/faculty/assessments/marks` — Post student marks.
- `GET /api/v1/admin/students` — Student search, filter, and pagination.
- `POST /api/v1/admin/students` — Enroll new student.
- `GET /api/v1/admin/courses` — Course offerings and enrollment statistics.
- `GET /api/v1/admin/faculty` — Faculty roster and teaching loads.
- `GET /api/v1/admin/reports` — Institutional analytics (GPA, Fee recovery, Attendance).

