"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { CalendarCheck, Award, FileText, ClipboardList, MapPin, Clock } from "lucide-react";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      try {
        setLoading(true);
        const res = await apiService.exams.getSchedule();
        setExams(res.exams || []);
      } catch (err) {
        console.error("Exams load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-royal-600" />
            <span>Examination Schedule — Fall 2026</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Controller of Examinations • Official Schedules & Room Allocations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/seating-plan"
            className="px-3 py-1.5 bg-royal-50 dark:bg-royal-950 text-royal-700 dark:text-royal-300 border border-royal-200 dark:border-royal-800 rounded-lg text-xs font-semibold hover:bg-royal-100 flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" /> Seating Plan
          </Link>
          <Link
            href="/admit-card"
            className="px-3 py-1.5 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4" /> Print Admit Card
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-royal-700 text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Exam Session</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Date & Day</th>
                    <th className="py-3 px-4">Timings</th>
                    <th className="py-3 px-4">Hall / Room</th>
                    <th className="py-3 px-4">Seat No</th>
                    <th className="py-3 px-4">Paper Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {exams.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No upcoming examination dates scheduled yet.
                      </td>
                    </tr>
                  ) : (
                    exams.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                        <td className="py-3 px-4 font-bold text-royal-700 dark:text-royal-300">
                          {e.examTitle}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <span className="font-bold text-royal-600">{e.courseCode}</span> — {e.courseName}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                          {e.examDate}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {e.startTime} - {e.endTime}
                        </td>
                        <td className="py-3 px-4 font-bold text-royal-600 dark:text-royal-400">
                          {e.roomNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black">
                            {e.seatNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">
                          {e.paperType}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Online Exam Quick Access Callout */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-royal-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-royal-300 text-xs font-bold uppercase tracking-wider mb-1">
                <ClipboardList className="w-4 h-4" /> Interactive Online Examination
              </div>
              <h3 className="text-base font-bold">Software Construction & Architecture Quiz 1</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Timer enabled • Auto-save responses • Instant score computation
              </p>
            </div>
            <Link
              href="/online-exam"
              className="px-5 py-2.5 rounded-lg bg-royal-500 hover:bg-royal-600 font-bold text-xs text-white shadow transition-colors shrink-0"
            >
              Start Online Exam
            </Link>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

