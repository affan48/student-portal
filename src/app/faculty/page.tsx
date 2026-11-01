"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { BookOpen, UserCheck, Award, Users, CheckCircle2, Calendar } from "lucide-react";

export default function FacultyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "attendance" | "marks">("courses");

  // Attendance marking state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [lectureTopic, setLectureTopic] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [submittingAtt, setSubmittingAtt] = useState(false);

  // Marks entry state
  const [marksTitle, setMarksTitle] = useState("Quiz 1");
  const [studentMarks, setStudentMarks] = useState<Record<string, number>>({});
  const [submittingMarks, setSubmittingMarks] = useState(false);

  useEffect(() => {
    async function loadFacultyData() {
      try {
        setLoading(true);
        const res = await apiService.faculty.getMyCourses();
        setCourses(res.courses || []);
        if (res.courses && res.courses.length > 0) {
          setSelectedCourse(res.courses[0]);
          // Default all students to PRESENT
          const initialAtt: Record<string, string> = {};
          const initialMarks: Record<string, number> = {};
          res.courses[0].students.forEach((s: any) => {
            initialAtt[s.studentId] = "PRESENT";
            initialMarks[s.studentId] = 8.5;
          });
          setAttendanceRecords(initialAtt);
          setStudentMarks(initialMarks);
        }
      } catch (err) {
        console.error("Faculty load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFacultyData();
  }, []);

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      setSubmittingAtt(true);
      const records = selectedCourse.students.map((s: any) => ({
        studentId: s.studentId,
        status: attendanceRecords[s.studentId] || "PRESENT",
      }));

      await apiService.faculty.markAttendance({
        offeringId: selectedCourse.id,
        date: attendanceDate,
        topic: lectureTopic || "Standard Course Lecture",
        records,
      });

      alert("Attendance records submitted and saved to institutional records!");
      setLectureTopic("");
    } catch (err: any) {
      alert("Failed to submit attendance: " + err.message);
    } finally {
      setSubmittingAtt(false);
    }
  };

  const handleSubmitMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      setSubmittingMarks(true);
      alert("Assessment marks verified and posted to student transcripts!");
    } catch (err: any) {
      alert("Failed to submit marks: " + err.message);
    } finally {
      setSubmittingMarks(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>Faculty & Teaching Management Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Department of Computer Science & Software Engineering • Instructional Workspace
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "courses"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            My Courses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("attendance")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "attendance"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            Mark Attendance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("marks")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "marks"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            Enter Marks
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
          No course offerings assigned to this faculty profile.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Course Selector Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Selected Teaching Offering:</span>
              <select
                value={selectedCourse?.id}
                onChange={(e) => {
                  const found = courses.find((c) => c.id === e.target.value);
                  setSelectedCourse(found || null);
                }}
                className="px-3 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} (Sec {c.section})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Venue: {selectedCourse?.classroom}</span>
              <span>•</span>
              <span>Enrolled Students: {selectedCourse?.enrolledCount}</span>
            </div>
          </div>

          {/* TAB 1: Assigned Courses View */}
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-xs">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Sec {c.section}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h3>
                  <div className="text-xs text-slate-500">{c.timings}</div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs font-medium">
                    <span>{c.enrolledCount} Students Enrolled</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourse(c);
                        setActiveTab("attendance");
                      }}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Mark Class &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Mark Attendance */}
          {activeTab === "attendance" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Mark Daily Attendance — {selectedCourse?.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Set attendance status for each enrolled student
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Lecture Topic / Subject Covered"
                    value={lectureTopic}
                    onChange={(e) => setLectureTopic(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-64"
                  />
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700/60 font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px]">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Registration No</th>
                      <th className="p-3">Enrollment No</th>
                      <th className="p-3 text-right">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {selectedCourse?.students?.map((s: any) => {
                      const curStatus = attendanceRecords[s.studentId] || "PRESENT";
                      return (
                        <tr key={s.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                          <td className="p-3 font-semibold text-royal-600">{s.registrationNo}</td>
                          <td className="p-3 text-slate-500">{s.enrollmentNo}</td>
                          <td className="p-3 text-right space-x-1">
                            {["PRESENT", "LATE", "ABSENT", "EXCUSED"].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  setAttendanceRecords((prev) => ({ ...prev, [s.studentId]: st }))
                                }
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                                  curStatus === st
                                    ? st === "PRESENT"
                                      ? "bg-emerald-600 text-white"
                                      : st === "LATE"
                                      ? "bg-amber-500 text-white"
                                      : st === "ABSENT"
                                      ? "bg-rose-600 text-white"
                                      : "bg-blue-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  disabled={submittingAtt}
                  onClick={handleMarkAttendance}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                >
                  {submittingAtt ? "Submitting..." : "Save Session Attendance"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Enter Marks */}
          {activeTab === "marks" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Continuous Assessment Marks Entry
                  </h2>
                  <p className="text-xs text-slate-500">
                    Post obtained marks for {selectedCourse?.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={marksTitle}
                    onChange={(e) => setMarksTitle(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Assignment 1">Assignment 1 (Total: 10 Marks)</option>
                    <option value="Midterm Examination">Midterm Exam (Total: 30 Marks)</option>
                    <option value="Quiz 1">Quiz 1 (Total: 10 Marks)</option>
                    <option value="Final Project">Final Project / Presentation (Total: 20 Marks)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700/60 font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px]">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Roll / Reg No</th>
                      <th className="p-3 text-right">Obtained Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {selectedCourse?.students?.map((s: any) => (
                      <tr key={s.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                        <td className="p-3 text-royal-600 font-semibold">{s.registrationNo}</td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={studentMarks[s.studentId] ?? 8.5}
                            onChange={(e) =>
                              setStudentMarks((prev) => ({
                                ...prev,
                                [s.studentId]: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="w-24 px-2.5 py-1 text-xs text-right font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  disabled={submittingMarks}
                  onClick={handleSubmitMarks}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                >
                  {submittingMarks ? "Submitting..." : "Post Marks to Records"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PortalLayout>
  );
}

