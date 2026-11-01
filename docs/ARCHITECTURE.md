# System Architecture & Technical Specifications

## 1. Architectural Philosophy
The University Management System (UMS) and Student Information System (SIS) is engineered to meet enterprise institutional standards, inspired by the UIT University EDU Smart Portal. The system decouples presentation, business services, authentication, and database tiers while providing a unified Next.js 15 App Router architecture.

```
┌────────────────────────────────────────────────────────┐
│                   Client Tier (Next.js)                │
│   • Accessibility Provider (WCAG 2.2 AA)              │
│   • Auth Context & Role Switcher                       │
│   • Responsive Desktop / Tablet / Mobile Shell         │
│   • Student Portal, Faculty Portal, Admin Console      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON REST
┌──────────────────────────▼─────────────────────────────┐
│                 Service Layer (API Client)             │
│   • Token Injection & Cookie Transport                 │
│   • Request Interception & Error Standardization      │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│             Backend API Route Handlers (/api/v1)       │
│   • Authentication Guards & JWT Verification           │
│   • Server-Side Identity Isolation (No Cross-Tenant)   │
│   • Financial Debit/Credit Calculations               │
│   • Automated Exam Evaluation Engine                   │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                    Prisma ORM Layer                    │
│   • Normalized Relational Modeling                     │
│   • Foreign Key Integrity & Cascades                  │
│   • SQLite (Dev) / PostgreSQL (Prod) Compatibility     │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│              Relational Database (PostgreSQL)          │
└────────────────────────────────────────────────────────┘
```

## 2. Core Modules Architecture
1. **Student Dashboard & Overview**: Real-time academic metrics, four primary stats cards, enrolled course timetable, login activity audit trails, announcements, todos, and degree completion meter.
2. **Academic & Course Module**: Detailed course outlines, instructional staff contact, continuous assessments, and learning resources.
3. **Examination & Assessment Suite**:
   - Examination schedules and room allocations.
   - Examination Seating Plans with allocated seat numbers.
   - Interactive Online Examination Engine with server-side timer, question navigator, and autosave.
   - Unofficial Transcript with GPA/CGPA calculations.
   - Printable Official Admit Card with verified barcode.
4. **Finance & Accounting Ledger**:
   - Running ledger with debits (charging) and credits (payments).
   - Fee Challans with bank deposit instructions.
   - Payment processing with balance recalculation.
5. **General Services**:
   - Weekly interactive timetable grid.
   - Course registration engine with 21 credit hour limit validation.
   - 4-Year Academic Road Map.
   - Program Learning Outcome (PLO) attainment visualization.
   - Academic workflow requests with approval hierarchies.
   - Faculty evaluation surveys.
   - Messaging system.
6. **Faculty & Instructional Workspace**:
   - Course assignment roster.
   - Daily attendance marking.
   - Assessment marks entry.
7. **University Administration Console**:
   - Institutional dashboard with student, faculty, and financial metrics.
   - Student enrollment management.
   - Course catalog and offerings management.
   - Institutional reports (GPA distribution, fee recovery, attendance compliance).

## 3. Accessibility Architecture (WCAG 2.2 AA)
- 4 font-size levels (`small`, `default`, `large`, `xlarge`) applied globally via HTML classes.
- High Contrast mode for weak eyesight and vision impairment.
- Dark theme mode.
- Accessible keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-royal-600`).
- Minimum 44x44px touch targets.
- Text and data alternatives for all charts and meters.

