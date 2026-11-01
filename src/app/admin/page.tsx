"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import {
  ShieldAlert,
  Users,
  BookOpen,
  DollarSign,
  Award,
  Plus,
  Search,
  FileText,
  Building,
  GraduationCap,
} from "lucide-react";

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "courses" | "reports">("overview");

  // Search & New Student modal
  const [searchStudent, setSearchStudent] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRegNo, setNewRegNo] = useState("");
  const [newEnrollNo, setNewEnrollNo] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, stdRes, crsRes, repRes]: any[] = await Promise.all([
        apiService.dashboard.getAdminDashboard(),
        apiService.admin.getStudents(1, searchStudent),
        apiService.admin.getCoursesList(),
        apiService.admin.getReports(),
      ]);
      setDashboard(dashRes);
      setStudents(stdRes.students || []);
      setCourses(crsRes.courses || []);
      setReports(repRes.reports);
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchStudent]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      await apiService.admin.createStudent({
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        registrationNo: newRegNo,
        enrollmentNo: newEnrollNo,
      });
      alert("Student enrolled successfully in SIS database!");
      setShowAddStudent(false);
      setNewFirstName("");
      setNewLastName("");
      setNewEmail("");
      setNewRegNo("");
      setNewEnrollNo("");
      loadData();
    } catch (err: any) {
      alert("Failed to enroll student: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            <span>University Administration & Operations Console</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Super Administrator & Registrar Controls • Complete Institutional Management
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "students"
                ? "bg-purple-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            Students
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "courses"
                ? "bg-purple-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            Course Catalog
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === "reports"
                ? "bg-purple-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === "overview" && dashboard && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Enrolled Students
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {dashboard.metrics.totalStudents}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    {dashboard.metrics.activeStudents} Active Status
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Instructional Faculty
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {dashboard.metrics.facultyCount}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">CS & SE Department</div>
                </div>

                <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 shadow-sm">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Fee Collected
                  </div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    PKR {dashboard.metrics.feeCollected.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Verified Bank Receipts</div>
                </div>

                <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 shadow-sm">
                  <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Outstanding Dues
                  </div>
                  <div className="text-2xl font-black text-amber-700 mt-1">
                    PKR {dashboard.metrics.outstandingDues.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-800/70 mt-0.5">Unpaid Fee Challans</div>
                </div>
              </div>

              {/* Departmental Structure Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>Academic Departments & Programs</span>
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-700/60 font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px]">
                        <th className="p-3">Department Name</th>
                        <th className="p-3">Code</th>
                        <th className="p-3 text-center">Students</th>
                        <th className="p-3 text-center">Faculty</th>
                        <th className="p-3 text-center">Courses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {dashboard.departments.map((d: any) => (
                        <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{d.name}</td>
                          <td className="p-3 font-semibold text-royal-600">{d.code}</td>
                          <td className="p-3 text-center font-bold">{d.studentsCount}</td>
                          <td className="p-3 text-center font-bold">{d.facultyCount}</td>
                          <td className="p-3 text-center font-bold">{d.coursesCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS MANAGEMENT */}
          {activeTab === "students" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, roll no, or enrollment..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddStudent(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll New Student</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-700/60 font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px]">
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Registration No</th>
                        <th className="p-3">Enrollment No</th>
                        <th className="p-3">Program & Sec</th>
                        <th className="p-3 text-center">CGPA</th>
                        <th className="p-3 text-right">Fee Balance</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            <div>{s.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{s.email}</div>
                          </td>
                          <td className="p-3 font-semibold text-royal-600">{s.registrationNo}</td>
                          <td className="p-3 font-mono text-slate-500">{s.enrollmentNo}</td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {s.program}
                            </span>{" "}
                            <span className="text-slate-400">({s.section})</span>
                          </td>
                          <td className="p-3 text-center font-black text-royal-700 dark:text-royal-300">
                            {s.cgpa.toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-bold text-amber-700 dark:text-amber-400">
                            PKR {s.currentBalance.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {s.academicStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COURSE CATALOG */}
          {activeTab === "courses" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Active University Courses & Offerings</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700/60 font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px]">
                      <th className="p-3">Course Code</th>
                      <th className="p-3">Course Name</th>
                      <th className="p-3 text-center">Credit Hours</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Current Offering Instructor</th>
                      <th className="p-3 text-center">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {courses.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-3 font-extrabold text-royal-700 dark:text-royal-300">
                          {c.code}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{c.name}</td>
                        <td className="p-3 text-center font-semibold">{c.creditHours}</td>
                        <td className="p-3 text-slate-500">{c.department}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {c.offerings[0]?.instructor || "Unassigned"}
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-600">
                          {c.offerings[0]?.enrolled || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INSTITUTIONAL REPORTS */}
          {activeTab === "reports" && reports && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  GPA Academic Standing Distribution
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>CGPA 3.50 - 4.00 (Dean&apos;s Honor List)</span>
                    <span className="font-bold text-emerald-600">{reports.gpaDistribution.above3_5} students</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>CGPA 3.00 - 3.49 (First Division)</span>
                    <span className="font-bold text-royal-600">{reports.gpaDistribution.between3_0_and_3_49} students</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>CGPA 2.50 - 2.99 (Good Standing)</span>
                    <span className="font-bold text-amber-600">{reports.gpaDistribution.between2_5_and_2_99} students</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>CGPA &lt; 2.50 (Academic Warning)</span>
                    <span className="font-bold text-rose-600">{reports.gpaDistribution.below2_5} students</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Institutional Fee Recovery Audit
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>Total Invoiced</span>
                    <span className="font-bold">PKR {reports.feeCollection.totalInvoiced.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Realized Collection</span>
                    <span className="font-bold text-emerald-600">PKR {reports.feeCollection.totalCollected.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Outstanding Receivables</span>
                    <span className="font-bold text-amber-600">PKR {reports.feeCollection.totalOutstanding.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Recovery Percentage</span>
                    <span className="font-black text-royal-600">{reports.feeCollection.recoveryRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enroll New Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1">
              Enroll Student in SIS
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add new student profile and create user credentials
            </p>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  University Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@uit.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registration No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="23SP-099-SE"
                    value={newRegNo}
                    onChange={(e) => setNewRegNo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enrollment No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="UITU-23SP-UGRAD-00999"
                    value={newEnrollNo}
                    onChange={(e) => setNewEnrollNo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                >
                  {creating ? "Enrolling..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
