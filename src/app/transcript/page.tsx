"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { FileText, Printer, Award, ShieldCheck, Download } from "lucide-react";

export default function TranscriptPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranscript() {
      try {
        setLoading(true);
        const res = await apiService.exams.getTranscript();
        setData(res.transcript);
      } catch (err) {
        console.error("Transcript load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTranscript();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-royal-600" />
            <span>Student Unofficial Transcript</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete cumulative academic record, course credits, and semester GPA history
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Transcript</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
          {/* Institutional Header */}
          <div className="border-b-2 border-royal-700 pb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded-full border-2 border-royal-800 bg-white flex items-center justify-center font-black text-royal-800 text-xs shadow-sm">
                UIT
              </div>
              <div>
                <h2 className="text-lg font-black text-navy-900 dark:text-white tracking-tight">
                  UIT UNIVERSITY
                </h2>
                <div className="text-xs font-bold text-royal-600">
                  OFFICE OF THE CONTROLLER OF EXAMINATIONS
                </div>
                <div className="text-[11px] text-slate-500">
                  Deh Dih, University Road, Gulshan-e-Iqbal, Karachi, Pakistan
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded bg-amber-100 text-amber-800 font-extrabold text-[11px] uppercase tracking-wider">
                Unofficial Transcript
              </span>
              <div className="text-[11px] text-slate-500 mt-1">
                Issued for Student Advisory Use
              </div>
            </div>
          </div>

          {/* Student Profile Metadata Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Student Name:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {data.student.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Registration No:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {data.student.registrationNo}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Enrollment No:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {data.student.enrollmentNo}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Program of Study:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {data.student.program}
              </span>
            </div>
          </div>

          {/* CGPA Summary Banner */}
          <div className="p-4 rounded-xl bg-royal-50 dark:bg-royal-950/40 border border-royal-200 dark:border-royal-900 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-royal-700 dark:text-royal-300 font-semibold">Cumulative GPA:</span>
                <span className="text-2xl font-black text-royal-900 dark:text-royal-100 block">
                  {data.summary.cgpa.toFixed(2)} / 4.00
                </span>
              </div>
              <div className="w-px h-8 bg-royal-300 dark:bg-royal-800" />
              <div>
                <span className="text-slate-500">Credits Earned:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 block">
                  {data.summary.creditsEarned} / {data.summary.totalDegreeCredits}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-500">Academic Standing: </span>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                {data.summary.academicStanding}
              </span>
            </div>
          </div>

          {/* Semesters Tables */}
          <div className="space-y-6">
            {data.semesters.map((sem: any) => (
              <div
                key={sem.semesterName}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                <div className="p-3 bg-slate-100 dark:bg-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{sem.semesterName}</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>Credits: {sem.creditsEarned}</span>
                    <span>•</span>
                    <span className="text-royal-600 dark:text-royal-300 font-black">
                      Semester GPA: {sem.gpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 px-3">Course Code</th>
                      <th className="py-2 px-3">Course Title</th>
                      <th className="py-2 px-3 text-center">Credit Hours</th>
                      <th className="py-2 px-3 text-center">Grade Letter</th>
                      <th className="py-2 px-3 text-right">Grade Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {sem.courses.map((c: any) => (
                      <tr key={c.code} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                          {c.code}
                        </td>
                        <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{c.name}</td>
                        <td className="py-2 px-3 text-center">{c.credits}</td>
                        <td className="py-2 px-3 text-center font-bold text-royal-600 dark:text-royal-400">
                          {c.gradeLetter}
                        </td>
                        <td className="py-2 px-3 text-right font-medium">{c.gpaPoint.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Official Grading Scheme Table */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              UIT University Grading Scale Reference
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              {data.gradingScheme.map((g: any) => (
                <div
                  key={g.grade}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700"
                >
                  <div className="font-black text-royal-700 dark:text-royal-300">{g.grade}</div>
                  <div className="text-[10px] text-slate-500">{g.points} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </PortalLayout>
  );
}

