"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { HelpCircle, Star, CheckCircle2 } from "lucide-react";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSurvey, setActiveSurvey] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const res = await apiService.general.getSurveys();
      setSurveys(res.surveys || []);
      if (res.surveys && res.surveys.length > 0 && !activeSurvey) {
        setActiveSurvey(res.surveys[0]);
      }
    } catch (err) {
      console.error("Surveys load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleRating = (questionId: string, rating: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurvey) return;

    try {
      setSubmitting(true);
      await apiService.general.submitSurvey(activeSurvey.id, answers);
      alert("Faculty evaluation survey submitted successfully. Thank you for your feedback!");
      setAnswers({});
      loadSurveys();
    } catch (err: any) {
      alert("Failed to submit survey: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-royal-600" />
          <span>Faculty & Course Evaluation Surveys</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quality Enhancement Cell (QEC) • Anonymous feedback ensuring teaching quality and course alignment
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Survey List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Evaluations
            </h2>
            {surveys.map((s) => {
              const isSelected = activeSurvey?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSurvey(s);
                    setAnswers({});
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-royal-50 dark:bg-royal-950/40 border-royal-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300 font-extrabold text-[10px]">
                      {s.courseCode}
                    </span>
                    {s.isSubmitted && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mt-2">
                    {s.courseName}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">Instructor: {s.instructor}</div>
                </div>
              );
            })}
          </div>

          {/* Survey Questionnaire Panel */}
          <div className="lg:col-span-2">
            {activeSurvey ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                  <span className="text-xs font-bold text-royal-600">{activeSurvey.courseCode}</span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeSurvey.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">{activeSurvey.description}</p>
                </div>

                {activeSurvey.isSubmitted ? (
                  <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <div className="font-bold text-slate-800 dark:text-white">
                      You have already submitted this evaluation.
                    </div>
                    <div>Your anonymous responses have been compiled for the QEC report.</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {activeSurvey.questions.map((q: any, idx: number) => {
                      const currentRating = answers[q.id] || 0;
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-3"
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                            {idx + 1}. {q.questionText}
                          </div>

                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleRating(q.id, val)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                                  currentRating >= val
                                    ? "bg-amber-400 text-black shadow-sm"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>{val}</span>
                              </button>
                            ))}
                            <span className="text-[11px] text-slate-400 ml-2">
                              {currentRating === 5
                                ? "Strongly Agree"
                                : currentRating === 1
                                ? "Strongly Disagree"
                                : currentRating > 0
                                ? `Rating: ${currentRating}/5`
                                : "Select Rating"}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                      >
                        {submitting ? "Submitting Evaluation..." : "Submit Anonymous Evaluation"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

