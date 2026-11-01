"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  CalendarDays,
  FileText,
  UserCheck,
  CheckSquare,
  Compass,
  GitPullRequest,
  MessageSquare,
  Settings,
  HelpCircle,
  FileCheck2,
  Users,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isStudent = user?.role === "STUDENT" || !user;
  const isFaculty = user?.role === "FACULTY";
  const isAdmin = ["SUPER_ADMIN", "UNIVERSITY_ADMIN", "REGISTRAR", "FINANCE_OFFICER"].includes(
    user?.role || ""
  );

  const studentNavGroups = [
    {
      title: "Core Portal",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "My Courses", href: "/courses", icon: BookOpen },
        { label: "Attendance", href: "/attendance", icon: UserCheck },
        { label: "Timetable", href: "/timetable", icon: CalendarDays },
      ],
    },
    {
      title: "Examinations & Records",
      items: [
        { label: "Exam Schedules", href: "/exams", icon: CalendarCheck },
        { label: "Seating Plan", href: "/seating-plan", icon: Award },
        { label: "Online Exam", href: "/online-exam", icon: ClipboardList, badge: "Active" },
        { label: "Unofficial Transcript", href: "/transcript", icon: FileText },
        { label: "Print Admit Card", href: "/admit-card", icon: FileCheck2 },
      ],
    },
    {
      title: "Financials & Dues",
      items: [
        { label: "Financial Ledger", href: "/fees", icon: CreditCard },
        { label: "Fee Challans", href: "/fees/challans", icon: FileText },
      ],
    },
    {
      title: "Academic & Workflow",
      items: [
        { label: "Course Registration", href: "/registration", icon: CheckSquare, badge: "Fall 26" },
        { label: "Academic Road Map", href: "/roadmap", icon: Compass },
        { label: "PLO Attainment", href: "/plo", icon: Award },
        { label: "Work Flow Requests", href: "/workflow", icon: GitPullRequest },
        { label: "Feedbacks / Surveys", href: "/surveys", icon: HelpCircle, badge: "Pending" },
        { label: "Communication", href: "/communication", icon: MessageSquare },
        { label: "Accessibility Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  const facultyNavItems = [
    { label: "Faculty Dashboard", href: "/faculty", icon: LayoutDashboard },
    { label: "Assigned Courses", href: "/courses", icon: BookOpen },
    { label: "Mark Attendance", href: "/faculty?tab=attendance", icon: UserCheck },
    { label: "Assessment Marks", href: "/faculty?tab=marks", icon: Award },
    { label: "Student Roster", href: "/faculty?tab=students", icon: Users },
  ];

  const adminNavItems = [
    { label: "Admin Console", href: "/admin", icon: ShieldAlert },
    { label: "Student Management", href: "/admin?tab=students", icon: Users },
    { label: "Course Offerings", href: "/admin?tab=courses", icon: BookOpen },
    { label: "Finance & Ledgers", href: "/admin?tab=finance", icon: CreditCard },
    { label: "Institutional Reports", href: "/admin?tab=reports", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-royal-700 text-white flex items-center justify-center font-bold text-sm shadow">
              U
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">EDU Portal</div>
              <div className="text-[10px] text-slate-500 font-medium">Session: Fall 2026</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs"
          aria-label="Sidebar Navigation"
        >
          {/* Student navigation */}
          {studentNavGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
                {group.title}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                          isActive
                            ? "bg-royal-600 text-white font-semibold shadow-sm"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-royal-100 text-royal-700 dark:bg-royal-950 dark:text-royal-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Quick Cross-Role Panels */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="px-3 mb-2 font-bold uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-400">
              Role Portals
            </div>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/faculty"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-medium"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Faculty Portal</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-medium"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>Admin Console</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-700 dark:text-slate-300">UIT University SIS</div>
          <div>v2.6.4 • Fall 2026 Session</div>
        </div>
      </aside>
    </>
  );
}

