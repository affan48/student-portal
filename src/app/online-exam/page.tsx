"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { ClipboardList, Clock, CheckCircle, Save, AlertCircle, Award } from "lucide-react";

export default function OnlineExamPage() {
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<"SAVED" | "SAVING" | "IDLE">("SAVED");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    async function loadOnlineExam() {
      try {
        setLoading(true);
        const res = await apiService.exams.getOnlineExam();
        if (res.exam) {
          setExamData(res.exam);
          setAnswers(res.exam.savedAnswers || {});
          setRemainingSeconds(res.exam.remainingSeconds);
          if (res.exam.status === "SUBMITTED") {
            setSubmitted(true);
            setScoreResult({ score: res.exam.totalScore || 0, total: res.exam.totalMarks });
          }
        }
      } catch (err) {
        console.error("Online exam load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOnlineExam();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (remainingSeconds <= 0 || submitted) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, submitted]);

  const handleSelectOption = async (questionId: string, optionId: string) => {
    if (submitted) return;

    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setSaveStatus("SAVING");

    try {
      if (examData?.attemptId) {
        await apiService.exams.saveOnlineExamAnswer(examData.attemptId, questionId, optionId);
        setSaveStatus("SAVED");
      }
    } catch (err) {
      console.error("Save answer failed:", err);
      setSaveStatus("IDLE");
    }
  };

  const handleSubmitExam = async () => {
    if (!examData?.attemptId || submitted) return;

    try {
      setLoading(true);
      const res = await apiService.exams.submitOnlineExam(examData.attemptId);
      setSubmitted(true);
      setScoreResult({ score: res.score, total: res.totalMarks });
    } catch (err: any) {
      alert("Submission error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-royal-600" />
            <span>Online Examination Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Server-timed assessment with automatic answer synchronization
          </p>
        </div>

        {/* Live Timer Pill */}
        {!submitted && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm shadow-sm ${
              remainingSeconds < 300
                ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            }`}
          >
            <Clock className="w-4 h-4 text-royal-600" />
            <span>Time Left: {formatTimer(remainingSeconds)}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : submitted && scoreResult ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Examination Completed & Submitted!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your responses have been processed and archived in the institutional examination database.
          </p>

          <div className="my-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Obtained Score
            </div>
            <div className="text-4xl font-black text-royal-600 dark:text-royal-400 mt-2">
              {scoreResult.score} / {scoreResult.total}
            </div>
            <div className="text-xs text-emerald-600 font-bold mt-1">
              {Math.round((scoreResult.score / scoreResult.total) * 100)}% Performance
            </div>
          </div>

          <button
            onClick={() => window.location.href = "/exams"}
            className="px-6 py-2.5 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
          >
            Return to Exam Schedules
          </button>
        </div>
      ) : examData ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Card */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300 font-extrabold text-xs">
                    Question {currentQIndex + 1} of {examData.questions.length}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({examData.questions[currentQIndex]?.marks} Marks)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Save className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{saveStatus === "SAVING" ? "Saving..." : "Auto-saved"}</span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
                {examData.questions[currentQIndex]?.questionText}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {examData.questions[currentQIndex]?.options.map((opt: any) => {
                  const currentQId = examData.questions[currentQIndex].id;
                  const isSelected = answers[currentQId] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQId, opt.id)}
                      className={`w-full text-left p-4 rounded-xl border font-medium text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-royal-50 dark:bg-royal-950/40 border-royal-600 text-royal-900 dark:text-royal-100 ring-2 ring-royal-600"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span>{opt.optionText}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-royal-600 bg-royal-600 text-white" : "border-slate-400"
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQIndex < examData.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-lg bg-royal-600 hover:bg-royal-700 text-white text-xs font-semibold shadow-sm"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Question Palette
              </h3>

              <div className="grid grid-cols-4 gap-2">
                {examData.questions.map((q: any, idx: number) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = idx === currentQIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                        isCurrent
                          ? "ring-2 ring-royal-600 bg-royal-600 text-white"
                          : isAnswered
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400" />
                  <span>Answered ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-400" />
                  <span>Unanswered ({examData.questions.length - Object.keys(answers).length})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitExam}
                className="w-full mt-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Submit Examination
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PortalLayout>
  );
}

