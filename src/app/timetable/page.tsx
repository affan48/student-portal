"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { CalendarDays, MapPin, User, Clock, Printer } from "lucide-react";

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimetable() {
      try {
        setLoading(true);
        const res = await apiService.academic.getTimetable();
        setTimetable(res.timetable || []);
      } catch (err) {
        console.error("Timetable load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimetable();
  }, []);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-royal-600" />
            <span>Weekly Class Timetable — Fall 2026</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section: A • BS Software Engineering • UIT University Main Campus
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Schedule</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day) => {
            const dayEntries = timetable.filter((t) => t.dayOfWeek === day);
            const isToday =
              new Date().toLocaleDateString("en-US", { weekday: "long" }) === day;

            return (
              <div
                key={day}
                className={`rounded-xl border shadow-sm overflow-hidden flex flex-col ${
                  isToday
                    ? "border-royal-500 bg-royal-50/20 dark:bg-royal-950/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                <div
                  className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center justify-between ${
                    isToday
                      ? "bg-royal-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-extrabold">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="p-3 flex-1 space-y-3">
                  {dayEntries.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 italic">
                      No scheduled lectures
                    </div>
                  ) : (
                    dayEntries.map((e) => (
                      <div
                        key={e.id}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2 hover:border-royal-400 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300 font-bold text-[10px]">
                            {e.courseCode}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-royal-600" />
                            {e.startTime} - {e.endTime}
                          </span>
                        </div>

                        <div className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                          {e.courseName}
                        </div>

                        <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{e.instructor}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-royal-600 dark:text-royal-400 font-medium">
                            <MapPin className="w-3 h-3" />
                            <span>{e.room}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PortalLayout>
  );
}

