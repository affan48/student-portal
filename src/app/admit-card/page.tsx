"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { FileCheck2, Printer, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdmitCardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmitCard() {
      try {
        setLoading(true);
        const res = await apiService.exams.getAdmitCard();
        setData(res.admitCard);
      } catch (err) {
        console.error("Admit card load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdmitCard();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-royal-600" />
            <span>Official Examination Admit Card</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Controller of Examinations • Verified Admit Slip for Theory & Lab Examinations
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Admit Slip</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-6 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="border-b-2 border-royal-800 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded-full border-2 border-royal-800 bg-white flex items-center justify-center font-black text-royal-800 text-xs shadow-sm">
                UIT
              </div>
              <div>
                <h2 className="text-lg font-black text-navy-900 dark:text-white">UIT UNIVERSITY</h2>
                <div className="text-xs font-bold text-royal-600">{data.examTitle}</div>
                <div className="text-[11px] text-slate-500">Academic Session: {data.session}</div>
              </div>
            </div>

            {/* Barcode Visual Representation */}
            <div className="text-center sm:text-right">
              <div className="font-mono text-xs font-bold tracking-widest bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded border border-slate-300">
                ||| | |||| | |||||| || | |||| ||
              </div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 mt-1">
                {data.barcode}
              </div>
            </div>
          </div>

          {/* Student Profile Info & Status */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs flex-1">
              <div>
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {data.student.name}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Registration Number:</span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {data.student.registrationNo}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Enrollment Number:</span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {data.student.enrollmentNo}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Section & Program:</span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Sec {data.student.section} • {data.student.program}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> Finance Cleared
              </span>
              <div className="w-24 h-28 border border-slate-300 bg-slate-100 rounded flex flex-col items-center justify-center text-[10px] text-slate-400 font-semibold">
                Photo ID
              </div>
            </div>
          </div>

          {/* Approved Examination Papers Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Approved Examination Schedule & Seating Allotment
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-royal-700 text-white font-bold uppercase text-[11px]">
                  <th className="p-2.5">Course Code</th>
                  <th className="p-2.5">Course Title</th>
                  <th className="p-2.5">Exam Date</th>
                  <th className="p-2.5">Timings</th>
                  <th className="p-2.5">Venue</th>
                  <th className="p-2.5 text-center">Seat</th>
                  <th className="p-2.5 text-center">Invigilator Sign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {data.courses.map((c: any) => (
                  <tr key={c.code} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-royal-700 dark:text-royal-300">{c.code}</td>
                    <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      {c.name}
                    </td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-300">{c.date}</td>
                    <td className="p-2.5 font-bold text-slate-700 dark:text-slate-200">{c.time}</td>
                    <td className="p-2.5 font-medium">{c.room}</td>
                    <td className="p-2.5 text-center font-black text-amber-700">{c.seat}</td>
                    <td className="p-2.5 text-center text-slate-300 border-l">__________</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions and Signatures */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div className="space-y-1 text-slate-500 max-w-md">
              <div className="font-bold text-slate-700 dark:text-slate-300">Mandatory Rules:</div>
              {data.rules.map((r: string, idx: number) => (
                <div key={idx} className="text-[11px] leading-relaxed">
                  • {r}
                </div>
              ))}
            </div>

            <div className="text-center border-t border-slate-400 pt-2 w-48 shrink-0">
              <div className="font-bold text-slate-800 dark:text-slate-200">Controller of Examinations</div>
              <div className="text-[10px] text-slate-500">UIT University, Karachi</div>
            </div>
          </div>
        </div>
      ) : null}
    </PortalLayout>
  );
}

