"use client";

import React from "react";
import { User, Hash, GraduationCap, Calendar, CheckCircle } from "lucide-react";

interface MyOverviewCardProps {
  name?: string;
  registrationNo?: string;
  programStructure?: string;
  currentSession?: string;
  status?: string;
}

export function MyOverviewCard({
  name = "Muhammad Affan Ahmed",
  registrationNo = "23SP-052-SE",
  programStructure = "(BS) - Software Engineering - 4YR",
  currentSession = "Fall 2026",
  status = "Active",
}: MyOverviewCardProps) {
  const fields = [
    { label: "Name", value: name, icon: User, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60" },
    { label: "Registration No", value: registrationNo, icon: Hash, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60" },
    { label: "Program Structure", value: programStructure, icon: GraduationCap, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/60" },
    { label: "Current Session", value: currentSession, icon: Calendar, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60" },
    { label: "Status", value: status, icon: CheckCircle, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 mb-6">
      <h2 className="text-base font-bold text-navy-900 dark:text-white mb-4">
        My Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {fields.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-3"
            >
              <div className={`p-2 rounded-lg shrink-0 ${f.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {f.label}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                  {f.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

