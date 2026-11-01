"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { UserCheck, CheckCircle2, XCircle, Clock, AlertTriangle, Filter } from "lucide-react";

export default function AttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("ALL");

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        const res = await apiService.attendance.getMyAttendance();
        setData(res);
      } catch (err) {
        console.error("Attendance load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const records = data?.records || [];
  const filtered = filterCourse === "ALL" ? records : records.filter((r: any) => r.courseCode === filterCourse);

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-royal-600" />
          <span>Attendance Compliance — Fall 2026</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Minimum 75% attendance is required under UIT University Academic Regulations to be eligible for Final Examinations.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Average Compliance
              </div>
              <div className="text-2xl font-black text-teal-600 mt-1">
                {data.summary.compliancePercentage}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Min required: 75%</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Sessions
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                {data.summary.totalSessions}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Delivered Lectures</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 shadow-sm text-center">
              <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Present
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {data.summary.presentCount}
              </div>
              <div className="text-[10px] text-emerald-700/70 mt-0.5">On time</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 shadow-sm text-center">
              <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Late
              </div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {data.summary.lateCount}
              </div>
              <div className="text-[10px] text-amber-700/70 mt-0.5">Partial Credit</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 shadow-sm text-center">
              <div className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                Absent
              </div>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {data.summary.absentCount}
              </div>
              <div className="text-[10px] text-rose-700/70 mt-0.5">Unexcused</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 shadow-sm text-center">
              <div className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                Status
              </div>
              <div className="text-sm font-black text-emerald-600 mt-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Eligible
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Exam Clearance OK</div>
            </div>
          </div>

          {/* Course-wise breakdown bars */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Subject-wise Compliance Rate
            </h2>

            <div className="space-y-4">
              {data.courseBreakdown.map((c: any) => (
                <div key={c.code} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">
                      {c.code} — {c.title}
                    </span>
                    <span
                      className={`font-bold ${
                        c.percentage >= 75 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {c.percentage}% ({c.present}/{c.total})
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.percentage >= 75 ? "bg-teal-600" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(c.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Log Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Detailed Lecture Session Log
              </h2>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">All Registered Courses</option>
                  {data.courseBreakdown.map((c: any) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Topic / Session Details</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {r.date}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-royal-600 dark:text-royal-400">
                          {r.courseCode}
                        </span>{" "}
                        <span className="text-slate-500 hidden sm:inline">- {r.courseTitle}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">{r.topic}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === "PRESENT"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : r.status === "LATE"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 italic">{r.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </PortalLayout>
  );
}

