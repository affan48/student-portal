"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { StudentIdBar } from "@/components/dashboard/StudentIdBar";
import { MyStatsCards } from "@/components/dashboard/MyStatsCards";
import { MyCoursesList } from "@/components/dashboard/MyCoursesList";
import { MyOverviewCard } from "@/components/dashboard/MyOverviewCard";
import { MyActivityTimeline } from "@/components/dashboard/MyActivityTimeline";
import { AnnouncementsCard } from "@/components/dashboard/AnnouncementsCard";
import { TodoListCard } from "@/components/dashboard/TodoListCard";
import { FeedbackSurveysCard } from "@/components/dashboard/FeedbackSurveysCard";
import { DegreeCompletionCard } from "@/components/dashboard/DegreeCompletionCard";
import { FinancialLedgerTable } from "@/components/dashboard/FinancialLedgerTable";
import { apiService } from "@/services/api";
import { StudentDashboardData } from "@/types";

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const result = await apiService.dashboard.getStudentDashboard();
        setData(result);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <PortalLayout>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="w-10 h-10 border-4 border-royal-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold">Loading student academic records...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
          <h2 className="font-bold text-base">Error Loading Dashboard</h2>
          <p className="text-xs mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : data ? (
        <div className="space-y-1">
          {/* 1. Student Identification Bar */}
          <StudentIdBar
            id={data.student.registrationNo}
            enrollmentNo={data.student.enrollmentNo}
            section={data.student.section}
            todayFormatted={data.student.todayFormatted}
          />

          {/* 2. My Stats 4 Cards */}
          <MyStatsCards
            currentBalance={data.stats.currentBalance}
            cgpa={data.stats.cgpa}
            registeredCourses={data.stats.registeredCourses}
            averageAttendance={data.stats.averageAttendance}
          />

          {/* 3. My Courses (Fall 2026) */}
          <MyCoursesList courses={data.courses} sessionName={data.student.currentSession} />

          {/* 4. My Overview */}
          <MyOverviewCard
            name={data.student.name}
            registrationNo={data.student.registrationNo}
            programStructure={data.student.program}
            currentSession={data.student.currentSession}
            status={data.student.academicStatus}
          />

          {/* 5. 2-Column Responsive Grid: Activities & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MyActivityTimeline activities={data.activities} />
            <AnnouncementsCard announcements={data.announcements} />
          </div>

          {/* 6. 2-Column Responsive Grid: Todo List & Feedbacks/Surveys */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodoListCard todos={data.todos} />
            <FeedbackSurveysCard surveys={data.surveys} />
          </div>

          {/* 7. Degree Completion Progress Meter */}
          <DegreeCompletionCard
            completedCredits={data.degreeCompletion.completedCredits}
            totalCredits={data.degreeCompletion.totalCredits}
          />

          {/* 8. Financial Ledger Transaction Table */}
          <FinancialLedgerTable
            currentBalance={data.stats.currentBalance}
            loanAmount={data.stats.loanAmount}
            rows={data.financialLedger}
          />
        </div>
      ) : null}
    </PortalLayout>
  );
}

