"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, MapPin, User, Clock, Search, ChevronRight } from "lucide-react";

interface CourseItem {
  id: string;
  code: string;
  title: string;
  instructor: string;
  room: string;
  timings: string;
  credits: number;
  attendanceRate?: number;
}

interface MyCoursesListProps {
  courses: CourseItem[];
  sessionName?: string;
}

export function MyCoursesList({
  courses,
  sessionName = "Fall 2026",
}: MyCoursesListProps) {
  const [search, setSearch] = useState("");

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()) ||
      c.room.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-royal-600" />
            <span>My Courses</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{sessionName} Registered Coursework</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500"
              aria-label="Filter courses"
            />
          </div>
          <Link
            href="/courses"
            className="px-3 py-1.5 bg-royal-50 dark:bg-royal-950 text-royal-600 dark:text-royal-300 rounded-lg text-xs font-semibold hover:bg-royal-100 border border-royal-200 dark:border-royal-800 shrink-0"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No courses matching &quot;{search}&quot;.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id || c.code}
              className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              {/* Course Title and Timings */}
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-900/60 dark:text-royal-300">
                    {c.code}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {c.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-500">Timings:</span>
                  <span>{c.timings}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="w-full md:w-56 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {c.instructor}
                </span>
              </div>

              {/* Room & Details Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-60">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-royal-500 shrink-0" />
                  <span className="font-medium">{c.room}</span>
                </div>

                <Link
                  href={`/courses#${c.code}`}
                  className="p-1.5 rounded-lg bg-royal-50 dark:bg-royal-950/60 text-royal-600 dark:text-royal-300 hover:bg-royal-600 hover:text-white transition-colors"
                  title={`View course details for ${c.title}`}
                  aria-label={`View course details for ${c.title}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

