# UIT University Management System (UMS) & Student Information System (SIS)

A production-ready University Management System and Student Information System inspired by the **UIT University EDU Smart Portal**.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL / SQLite**.

---

## 🌟 Key Features

### 1. Student Portal (UIT University Reference Experience)
- **Identification Bar**: Student ID (`23SP-052-SE`), Enrollment No (`UITU-23SP-UGRAD-00236`), Section `A`, Active Session `Fall 2026`.
- **My Stats**: Current Balance (`222,680.00`), CGPA (`2.68`), Registered Courses (`8.00`), Average Attendance (`83.43%`).
- **My Courses**: Enrolled courses with instructor names, timings, lecture halls/labs, and credit hours.
- **My Overview**: Student details, program structure (`BS Software Engineering - 4YR`), academic status.
- **My Activity**: Timeline audit trail of student login and logout events.
- **Announcements**: University notifications including Fall 2026 Course Registration.
- **Todo List**: Interactive pending academic tasks and teacher evaluations.
- **Feedbacks & Surveys**: Course quality assurance surveys.
- **Degree Completion**: Circular completion percentage meter (96 of 134 credits completed).
- **Financial Ledger**: Exact multi-column transaction table (Tuition, Semester Charges, Security Deposit, Exam Fees, running balance calculation).

### 2. Comprehensive Academic Modules
- **Timetable**: Weekly interactive timetable matrix.
- **Marked Attendance**: Lecture-by-lecture audit with compliance tracking against the 75% HEC/UIT threshold.
- **Course Registration**: Online course registration with live credit counter and 21 credit hour limit validation.
- **Exam Schedules & Seating Plan**: Hall allocations, desk numbers, reporting regulations.
- **Interactive Online Exam Engine**: Server-side countdown timer, question navigator, 10s auto-save, and automated scoring.
- **Unofficial Transcript**: Semester-by-semester GPA/CGPA breakdown and official grading scheme.
- **Official Print Admit Card & Lab Admit Card**: Printable examination admit slip with verified barcode.
- **Academic Road Map**: 8-semester curriculum progression.
- **Program Learning Outcomes (PLO)**: Attainment percentage charts against 60% OBE benchmarks.
- **Academic Workflow**: Formal student requests (Fee Installment, Course Withdrawal, Leave) with approval audit trails.
- **Communication**: Internal messaging between students and instructional faculty.

### 3. Vision & Accessibility Suite (WCAG 2.2 AA)
- 4 global font-size scaling levels (`small`, `default`, `large`, `xlarge`).
- High Contrast Mode toggle for weak eyesight and vision impairment.
- Dark theme mode.
- Visible keyboard focus indicators and ARIA semantics.
- Minimum 44×44px touch targets.
- Text alternatives for all meters and charts.

### 4. Faculty & Administration Portals
- **Faculty Portal**: Course rosters, daily lecture attendance marking, continuous assessment marks entry.
- **Administration Console**: Institutional metrics, student enrollment, course catalog, institutional reports (GPA distribution, fee recovery rate, attendance compliance).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node.js `v24`)
- npm `v9+`

### Installation
```bash
# 1. Clone or enter project directory
cd "studebt portal"

# 2. Install dependencies
npm install

# 3. Synchronize database schema (creates dev.db SQLite database)
npm run db:push

# 4. Seed database with UIT University Fall 2026 reference records
npm run db:seed

# 5. Run automated test suite
npm test

# 6. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🔑 Default Credentials & Role Switcher

Use the built-in **"Role: STUDENT" pill** in the top navigation bar to switch roles instantly, or log in via `/login`:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@uit.edu` | `Password123!` | Muhammad Affan Ahmed (`23SP-052-SE`) |
| **Faculty Member** | `faculty@uit.edu` | `Password123!` | Instructor / Teaching Roster |
| **Finance Officer** | `finance@uit.edu` | `Password123!` | Accounts, Challans & Payments |
| **Super Admin** | `admin@uit.edu` | `Password123!` | Full Institutional Management |
| **Registrar** | `registrar@uit.edu` | `Password123!` | Enrollments & Academic Records |

---

## 🧪 Testing
```bash
npm test
```
Executes unit and integration tests verifying:
1. Bcrypt password hashing and verification.
2. JWT access token generation and cryptographic payload verification.
3. GPA calculation engine.
4. Cumulative CGPA calculation engine (matching 2.68 reference value).
5. Attendance compliance rate mathematics.
6. Financial ledger running balance integrity (`PKR 222,680.00`).
7. Database relation integrity and seed verification.

---

## 🐳 Docker Deployment
```bash
# Start PostgreSQL and Application
docker-compose up -d --build
```

---

## 📂 Project Directory Structure

```
.
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Login page with demo role buttons
│   │   ├── admin/                 # University Administration Console
│   │   ├── admit-card/            # Printable Admit Card with Barcode
│   │   ├── attendance/            # Attendance breakdown & lecture log
│   │   ├── communication/         # Messaging with faculty/staff
│   │   ├── courses/               # Enrolled Course Outlines & Syllabus
│   │   ├── dashboard/             # Flagship UIT Student Dashboard
│   │   ├── exams/                 # Examination Schedules
│   │   ├── faculty/               # Faculty Teaching & Marks Portal
│   │   ├── fees/                  # Financial Ledger & Challans
│   │   ├── online-exam/           # Interactive Online Exam Engine
│   │   ├── plo/                   # PLO Attainment Progress
│   │   ├── registration/          # Regular Course Registration
│   │   ├── roadmap/               # 4-Year Academic Road Map
│   │   ├── seating-plan/          # Hall & Desk Seating Allotment
│   │   ├── settings/              # Accessibility Suite & Password
│   │   ├── surveys/               # QEC Faculty Evaluation Surveys
│   │   ├── timetable/             # Weekly Lecture Schedule
│   │   ├── transcript/            # Unofficial Transcript
│   │   ├── workflow/              # Academic Request Tracking
│   │   ├── api/v1/                # 28 RESTful Backend API Endpoints
│   │   ├── globals.css            # WCAG 2.2 Tokens & Font Scaling
│   │   └── layout.tsx             # Root Layout with Accessibility
│   ├── components/
│   │   ├── dashboard/             # Dashboard modular cards & tables
│   │   └── layout/                # Header, Sidebar, Accessibility Bar
│   ├── context/
│   │   ├── AccessibilityContext   # WCAG Font Scale, Contrast, Dark Mode
│   │   └── AuthContext            # JWT state & Role Switcher
│   ├── lib/
│   │   ├── auth.ts                # Bcrypt, JWT & Guard utilities
│   │   └── prisma.ts              # Prisma ORM Singleton
│   ├── services/
│   │   └── api.ts                 # Client-side API Service Layer
│   └── types/                     # TypeScript Interfaces
├── prisma/
│   ├── schema.prisma              # SQLite & Relational Schema
│   └── schema.postgresql.prisma   # PostgreSQL Schema
├── scripts/
│   └── seed.mjs                   # Comprehensive database seed script
├── test/
│   └── system.test.mjs            # Automated Unit & Integration Tests
├── docs/                          # Architecture, DB, API & Security Docs
├── Dockerfile                     # Multi-stage production container
├── docker-compose.yml             # Postgres + App deployment
└── package.json
```

---

## 📜 License
Developed for UIT University Academic Management.

