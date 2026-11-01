"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { Compass, CheckCircle2, Clock, Circle, BookOpen } from "lucide-react";

export default function RoadmapPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        setLoading(true);
        const res = await apiService.academic.getRoadmap();
        setData(res);
      } catch (err) {
        console.error("Roadmap load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-royal-600" />
          <span>Academic Degree Road Map</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {data?.program || "BS Software Engineering"} • 4-Year Academic Progression & Course Prerequisite Structure
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Degree Status Overview Banner */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-royal-600 uppercase tracking-wider">
                Degree Completion Tracker
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {Math.round((data.completedCredits / data.totalCredits) * 100)}% Completed
              </h2>
              <div className="text-xs text-slate-500">
                {data.completedCredits} of {data.totalCredits} credit hours satisfied
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-royal-500" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-300" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Planned</span>
              </div>
            </div>
          </div>

          {/* 8 Semesters Roadmap Grid */}
          <div className="space-y-6">
            {data.curriculum.map((sem: any) => (
              <div
                key={sem.semesterNo}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <div className="p-3.5 bg-slate-100 dark:bg-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-royal-600" />
                    <span>{sem.title}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      sem.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : sem.status === "IN_PROGRESS"
                        ? "bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {sem.status}
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sem.courses.map((c: any) => (
                    <div
                      key={c.code}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                        c.status === "PASSED"
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                          : c.status === "IN_PROGRESS"
                          ? "bg-royal-50/50 dark:bg-royal-950/20 border-royal-200 dark:border-royal-900/50"
                          : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <span className="text-royal-700 dark:text-royal-400">{c.code}</span>
                          <span className="text-[10px] text-slate-400">({c.credits} Cr)</span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                          {c.title}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {c.status === "PASSED" ? (
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            Grade: {c.grade}
                          </span>
                        ) : c.status === "IN_PROGRESS" ? (
                          <span className="font-bold text-royal-600 text-[10px]">Active</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Planned</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </PortalLayout>
  );
}

