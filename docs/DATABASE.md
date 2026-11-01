# Database Architecture & Relational Schema

## 1. Relational Entity Relationship Diagram
The schema is modeled via Prisma ORM supporting PostgreSQL in production and SQLite in development.

```
University
  └── Campus
        ├── Department
        │     ├── Program
        │     │     ├── Section
        │     │     ├── ProgramLearningOutcome (PLO)
        │     │     └── FeeStructure
        │     │           └── FeeComponent
        │     ├── Faculty
        │     └── Course
        │           ├── CoursePrerequisite
        │           └── CourseOffering
        │                 ├── Timetable
        │                 ├── AttendanceSession
        │                 │     └── AttendanceRecord
        │                 ├── Assessment
        │                 │     └── AssessmentResult
        │                 ├── OnlineExam
        │                 │     ├── ExamQuestion
        │                 │     │     └── ExamOption
        │                 │     └── ExamAttempt
        │                 │           └── ExamAnswer
        │                 ├── ExaminationSchedule
        │                 │     ├── ExamRoom
        │                 │     └── ExamSeat
        │                 └── CourseRegistration
        └── Classroom

User
  ├── Student
  │     ├── CourseRegistration
  │     ├── AttendanceRecord
  │     ├── AssessmentResult
  │     ├── ExamSeat
  │     ├── AdmitCard
  │     ├── FinancialLedger
  │     ├── FeeChallan
  │     │     └── Payment
  │     ├── StudentAcademicRecord
  │     ├── PLOAttainment
  │     ├── Workflow
  │     │     └── WorkflowApproval
  │     └── Todo
  ├── Faculty
  ├── Session
  ├── RefreshToken
  ├── LoginActivity
  ├── AuditLog
  └── UserAccessibilitySetting
```

## 2. Integrity & Financial Rules
1. **Monetary Precision**: Stored as exact numeric values, calculated via ledger debits and credits. Running balance cannot be modified arbitrarily; all balance changes require ledger entries.
2. **Identity Derivation**: Endpoints derive student identity directly from the authenticated session context, preventing student ID spoofing.
3. **Examination Security**: Online exam correct answers (`isCorrect`) are never exposed in questions API responses. Scores are evaluated exclusively server-side.
4. **Registration Constraints**: Students cannot exceed 21 credit hours per semester.
