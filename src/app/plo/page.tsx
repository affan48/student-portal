"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { Award, CheckCircle2, AlertTriangle } from "lucide-react";

export default function PLOPage() {
  const [plos, setPlos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPLO() {
      try {
        setLoading(true);
        const res = await apiService.academic.getPLO();
        setPlos(res.plos || []);
      } catch (err) {
        console.error("PLO load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPLO();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-royal-600" />
          <span>Program Learning Outcome (PLO) Attainment</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Outcome-Based Education (OBE) • Continuous assessment mapping against PEC & HEC Graduate Attributes
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-xs text-teal-800 dark:text-teal-200 flex items-center justify-between gap-4">
            <div>
              <strong>Institutional Benchmark:</strong> Minimum 60.0% attainment required in each PLO to meet graduation standards.
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-200 text-teal-900 dark:bg-teal-900 dark:text-teal-100 font-bold shrink-0">
              OBE Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plos.map((p) => {
              const isPassing = p.attainmentPercentage >= p.benchmark;
              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.code}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 flex items-center gap-1 ${
                        isPassing
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {isPassing ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Met
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" /> Below
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">
                        Attainment Percentage:
                      </span>
                      <span
                        className={`font-black ${
                          isPassing ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {p.attainmentPercentage.toFixed(1)}% (Target: {p.benchmark}%)
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isPassing ? "bg-teal-600" : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.min(p.attainmentPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

