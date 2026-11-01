"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { Award, MapPin, AlertCircle, Clock, Calendar } from "lucide-react";

export default function SeatingPlanPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeating() {
      try {
        setLoading(true);
        const res = await apiService.exams.getSeatingPlan();
        setPlans(res.seatingPlans || []);
      } catch (err) {
        console.error("Seating plan load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSeating();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-royal-600" />
          <span>Exam Seating Plan & Hall Allocation</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Assigned examination rooms, desk numbers, and reporting instructions for Fall 2026
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-royal-600 uppercase tracking-wider">
                    {p.courseCode}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {p.courseName}
                  </h2>
                </div>

                {/* Big Highlighted Seat Badge */}
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-4 py-2 rounded-xl">
                  <div>
                    <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                      Assigned Seat
                    </div>
                    <div className="text-xl font-black text-amber-900 dark:text-amber-100">
                      {p.seatNumber}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-amber-200 dark:bg-amber-800" />
                  <div>
                    <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                      Venue
                    </div>
                    <div className="text-sm font-extrabold text-amber-900 dark:text-amber-100">
                      {p.venue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-5">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-royal-600" /> Exam Date
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                    {p.examDate}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-royal-600" /> Exam Timings
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                    {p.startTime} - {p.endTime}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Reporting Time
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 mt-1 block">
                    {p.reportingTime} (Mandatory)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Hall Regulations
                </h3>
                <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {p.instructions.map((inst: string, idx: number) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}

