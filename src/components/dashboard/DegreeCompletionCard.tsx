"use client";

import React from "react";
import Link from "next/link";
import { Compass, GraduationCap } from "lucide-react";

interface DegreeCompletionCardProps {
  completedCredits?: number;
  totalCredits?: number;
}

export function DegreeCompletionCard({
  completedCredits = 96,
  totalCredits = 134,
}: DegreeCompletionCardProps) {
  const percentage = Math.round((completedCredits / totalCredits) * 100);
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6 text-center">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-teal-600" />
          <span>Degree Completion</span>
        </h2>
        <Link
          href="/roadmap"
          className="text-xs font-semibold text-royal-600 dark:text-royal-400 hover:underline flex items-center gap-1"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>View Road Map</span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth="8"
              className="dark:stroke-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#0D9488"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {percentage}%
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Completed
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-500">Completed Credits: </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{completedCredits}</span>
          </div>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
          <div>
            <span className="text-slate-500">Remaining Credits: </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {totalCredits - completedCredits}
            </span>
          </div>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
          <div>
            <span className="text-slate-500">Total Credits: </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{totalCredits}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
        Roadmaps are meant to be a guide for students and academic advisors in planning a path to a
        degree.
      </p>
    </div>
  );
}

