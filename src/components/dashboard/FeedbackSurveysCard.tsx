"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareText, ChevronRight, FileCheck } from "lucide-react";

interface SurveyItem {
  id: string;
  courseName: string;
  title: string;
}

interface FeedbackSurveysCardProps {
  surveys: SurveyItem[];
}

export function FeedbackSurveysCard({ surveys }: FeedbackSurveysCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-indigo-600" />
            <span>Feedbacks / Surveys</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Faculty Evaluation - Fall 2026</p>
        </div>
        <Link
          href="/surveys"
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          View
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {surveys.map((s) => (
          <Link
            key={s.id}
            href="/surveys"
            className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 px-2 rounded-lg transition-colors group"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-royal-600 transition-colors">
                {s.courseName}
              </div>
              <div className="text-[11px] text-slate-500">{s.title}</div>
            </div>
            <span className="text-xs font-semibold text-royal-600 dark:text-royal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Start Evaluation <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

