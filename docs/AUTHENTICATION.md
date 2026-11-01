# Authentication & Role-Based Access Control (RBAC)

## 1. Password Security
Passwords are hashed using `bcrypt` with a work factor of 10 (`bcrypt.hash(password, salt)`). Plain text passwords are never stored in the database or logged in application traces.

## 2. JWT Access and Refresh Tokens
- **Access Tokens**: Short-lived JSON Web Tokens signed with `JWT_SECRET`, valid for 24 hours. Contain user identification, role, studentId, and facultyId.
- **Refresh Tokens**: Signed with `JWT_REFRESH_SECRET`, valid for 7 days. Supports session prolongation without requiring re-entering credentials.
- **Transport**: Stored in client localStorage for programmatic API service authorization (`Authorization: Bearer <token>`) and set as an HttpOnly, Lax cookie for server rendering.

## 3. RBAC Roles Hierarchy
1. `SUPER_ADMIN` — System-wide configuration, audit logs, and user provisioning.
2. `UNIVERSITY_ADMIN` — Institutional management, departments, programs, and sessions.
3. `REGISTRAR` — Student enrollments, course catalogs, academic requests, and transcript verifications.
4. `FINANCE_OFFICER` — Fee structures, challan issuance, payment reconciliation, and ledger audits.
5. `EXAM_CONTROLLER` — Examination schedules, room and seating plan allocations, admit cards, and grade approval.
6. `DEPT_HEAD` — Program governance, faculty schedules, and student leave approvals.
7. `FACULTY` / `TEACHER` — Course instruction, daily lecture attendance marking, and continuous assessment grading.
8. `STUDENT` — Personal academic records, registrations, attendance, exam seating, fee ledger, and evaluations.

## 4. Contextual Identity Derivation
To protect student privacy and prevent horizontal privilege escalation, all `/me` endpoints (`/students/me/...`, `/finance/.../me`, etc.) resolve the student's database identifier from the verified JWT payload rather than trusting client-provided query parameters or body payloads.
