"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import {
  BookOpen,
  MapPin,
  Clock,
  User,
  FileText,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const res = await apiService.courses.getMyCourses();
        setCourses(res.courses || []);
        if (res.courses && res.courses.length > 0) {
          setExpandedCourse(res.courses[0].id);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-royal-600" />
          <span>My Enrolled Courses — Fall 2026</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed syllabus, weekly outlines, instructional staff, and continuous assessment breakdown
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((c) => {
            const isExpanded = expandedCourse === c.id;
            return (
              <div
                key={c.id}
                id={c.code}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                {/* Course Header Bar */}
                <div
                  onClick={() => setExpandedCourse(isExpanded ? null : c.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300 font-extrabold text-xs">
                      {c.code}
                    </span>
                    <div>
                      <h2 className="font-bold text-slate-900 dark:text-white text-base">
                        {c.name}
                      </h2>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-0.5">
                        <span>{c.creditHours} Credit Hours</span>
                        <span>•</span>
                        <span>Room: {c.classroom}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {c.instructor.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{c.instructor.designation}</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details: Schedule, Instructor contact, Assessments */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/30 space-y-6">
                    {/* Meta info grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                          <Clock className="w-3.5 h-3.5 text-royal-600" /> Timetable Schedule
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {c.timings}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                          <User className="w-3.5 h-3.5 text-royal-600" /> Instructor Contact
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {c.instructor.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{c.instructor.email}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-royal-600" /> Venue & Lab
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {c.classroom}
                        </div>
                        <div className="text-[11px] text-slate-500">Main Campus, UIT University</div>
                      </div>
                    </div>

                    {/* Assessments Breakdown */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" /> Continuous Assessment & Marks
                      </h3>
                      {c.assessments && c.assessments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold">
                                <th className="p-2.5">Assessment Title</th>
                                <th className="p-2.5">Type</th>
                                <th className="p-2.5 text-right">Total Marks</th>
                                <th className="p-2.5 text-right">Weightage</th>
                                <th className="p-2.5 text-right">Obtained Marks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                              {c.assessments.map((a: any) => (
                                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                  <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                                    {a.title}
                                  </td>
                                  <td className="p-2.5 text-slate-500">{a.type}</td>
                                  <td className="p-2.5 text-right">{a.totalMarks}</td>
                                  <td className="p-2.5 text-right">{a.weightage}%</td>
                                  <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                    {a.obtainedMarks !== null ? a.obtainedMarks : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          No assessment records posted for this course yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PortalLayout>
  );
}

