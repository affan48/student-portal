"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { CheckSquare, AlertCircle, BookOpen, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function RegistrationPage() {
  const [data, setData] = useState<any>(null);
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadRegistration = async () => {
    try {
      setLoading(true);
      const res = await apiService.academic.getRegistrationStatus();
      setData(res);
      if (res.courses) {
        const registered = res.courses
          .filter((c: any) => c.isRegistered)
          .map((c: any) => c.offeringId);
        setSelectedOfferingIds(registered);
      }
    } catch (err) {
      console.error("Failed to load registration:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistration();
  }, []);

  const toggleCourse = (offeringId: string) => {
    setSelectedOfferingIds((prev) =>
      prev.includes(offeringId) ? prev.filter((id) => id !== offeringId) : [...prev, offeringId]
    );
  };

  const currentSelectedCredits = data?.courses
    ? data.courses
        .filter((c: any) => selectedOfferingIds.includes(c.offeringId))
        .reduce((acc: number, c: any) => acc + c.creditHours, 0)
    : 0;

  const handleSubmit = async () => {
    if (currentSelectedCredits > 21) {
      setMessage({
        text: "Error: Selected credits exceed the institutional limit of 21 credit hours.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);
      const res = await apiService.academic.registerCourses(selectedOfferingIds);
      setMessage({ text: res.message || "Registration updated successfully!", type: "success" });
      loadRegistration();
    } catch (err: any) {
      setMessage({ text: err.message || "Registration submission failed", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-royal-600" />
            <span>Online Course Registration — Fall 2026</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Regular semester enrollment • Select required & elective courses within the 21 credit hour limit
          </p>
        </div>

        {/* Real-time Credits Tracker */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Credits
            </div>
            <div
              className={`text-xl font-black ${
                currentSelectedCredits > 21 ? "text-rose-600" : "text-royal-600 dark:text-royal-400"
              }`}
            >
              {currentSelectedCredits} / 21
            </div>
          </div>
          <button
            type="button"
            disabled={submitting || currentSelectedCredits > 21}
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting..." : "Save Registration"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-4">
          {data.courses.map((c: any) => {
            const isSelected = selectedOfferingIds.includes(c.offeringId);
            return (
              <div
                key={c.offeringId}
                onClick={() => toggleCourse(c.offeringId)}
                className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-royal-50/40 dark:bg-royal-950/30 border-royal-400 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by parent onClick
                    className="w-4 h-4 text-royal-600 rounded border-slate-300 mt-1 focus:ring-royal-500"
                    aria-label={`Select ${c.name}`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300 font-extrabold text-xs">
                        {c.code}
                      </span>
                      <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                        {c.name}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {c.creditHours} Credit Hours
                      </span>
                      <span>•</span>
                      <span>Instructor: {c.instructor}</span>
                      <span>•</span>
                      <span>Venue: {c.classroom}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.timings}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      isSelected
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {isSelected ? "Enrolled" : "Not Selected"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </PortalLayout>
  );
}

