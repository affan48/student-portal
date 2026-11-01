"use client";

import React, { useState } from "react";
import { Megaphone, Calendar, AlertCircle } from "lucide-react";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
}

interface AnnouncementsCardProps {
  announcements: AnnouncementItem[];
}

export function AnnouncementsCard({ announcements }: AnnouncementsCardProps) {
  const [modalItem, setModalItem] = useState<AnnouncementItem | null>(null);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-amber-500" />
          <span>Announcements</span>
        </h2>
        <button
          type="button"
          onClick={() => {
            if (announcements.length > 0) setModalItem(announcements[0]);
          }}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          View
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {a.date}
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                {a.title}
              </span>
              {a.priority === "HIGH" && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 ml-auto">
                  High Priority
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {a.content}
            </p>
          </div>
        ))}
      </div>

      {/* Full Modal Viewer */}
      {modalItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-amber-600">{modalItem.date}</span>
                <h3 className="text-base font-bold text-navy-900 dark:text-white mt-1">
                  {modalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {modalItem.content}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalItem(null)}
                className="px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

