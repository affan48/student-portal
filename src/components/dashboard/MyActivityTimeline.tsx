"use client";

import React, { useState } from "react";
import { Activity, Clock, ShieldCheck, LogIn, LogOut } from "lucide-react";

interface ActivityItem {
  id: string;
  date: string;
  time: string;
  details: string;
  action: string;
}

interface MyActivityTimelineProps {
  activities: ActivityItem[];
}

export function MyActivityTimeline({ activities }: MyActivityTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const displayed = expanded ? activities : activities.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          <span>My Activity</span>
        </h2>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          {expanded ? "Show Less" : "View"}
        </button>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {displayed.map((a) => {
          const isLogin = a.action === "LOGIN";
          return (
            <div key={a.id} className="relative flex items-start justify-between gap-4">
              {/* Circle dot on line */}
              <div
                className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 bg-white dark:bg-slate-800 ${
                  isLogin
                    ? "border-emerald-500 text-emerald-500"
                    : "border-slate-400 text-slate-400"
                }`}
              />

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 w-12 shrink-0">
                  {a.date}
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {a.details}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{a.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

