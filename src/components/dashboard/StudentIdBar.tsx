"use client";

import React from "react";

interface StudentIdBarProps {
  id?: string;
  enrollmentNo?: string;
  section?: string;
  todayFormatted?: string;
}

export function StudentIdBar({
  id = "23SP-052-SE",
  enrollmentNo = "UITU-23SP-UGRAD-00236",
  section = "A",
  todayFormatted = "Monday, Nov 02 2026",
}: StudentIdBarProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 shadow-sm mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-navy-900 dark:text-white text-sm tracking-tight">
            Dashboard
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-slate-600 dark:text-slate-300">
          <div>
            <span className="font-semibold text-slate-500 dark:text-slate-400">My ID: </span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{id}</span>
          </div>

          <div>
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              My Enrollment No.:{" "}
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{enrollmentNo}</span>
          </div>

          <div>
            <span className="font-semibold text-slate-500 dark:text-slate-400">My Section: </span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{section}</span>
          </div>

          <div className="ml-auto">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Today: </span>
            <span className="font-bold text-royal-600 dark:text-royal-400">{todayFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

