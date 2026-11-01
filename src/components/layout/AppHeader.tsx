"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  LogOut,
  User,
  Shield,
  BookOpen,
  DollarSign,
  Menu,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

interface AppHeaderProps {
  onToggleSidebar?: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const { user, studentProfile, logout, switchUserRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Student";
  const displayId = studentProfile?.registrationNo || user?.email || "";
  const initial = user?.firstName?.charAt(0) || "U";

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:ring-2 focus:ring-royal-600"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-3 group">
            {/* UIT University Oval Style Logo */}
            <div className="w-12 h-8 rounded-full border-2 border-royal-700 bg-white flex items-center justify-center shadow-sm px-1.5 overflow-hidden">
              <span className="text-royal-800 font-extrabold text-xs tracking-wider">UIT</span>
            </div>
            <div>
              <div className="font-bold text-navy-900 dark:text-white text-base leading-tight">
                UIT University
              </div>
              <div className="text-[11px] font-semibold text-royal-600 dark:text-royal-400 tracking-wide uppercase">
                EDU Smart Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Center / Right: Role Switcher & User Identification Bar */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Pill for Demo & Testing */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-royal-50 dark:bg-royal-950 text-royal-700 dark:text-royal-300 border border-royal-200 dark:border-royal-800 hover:bg-royal-100 transition-colors"
              title="Switch role to test all student, faculty and admin modules"
              aria-expanded={showRoleMenu}
            >
              <Shield className="w-3.5 h-3.5 text-royal-600" />
              <span>Role: {user?.role || "STUDENT"}</span>
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs"
                role="menu"
              >
                <div className="px-3 py-1.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Switch Role (Instant Testing)
                </div>
                <button
                  onClick={() => {
                    switchUserRole("STUDENT");
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-royal-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-white">Student (Affan Ahmed)</div>
                    <div className="text-[10px] text-slate-500">23SP-052-SE (BS Software Eng.)</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    switchUserRole("FACULTY");
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-white">Faculty Member</div>
                    <div className="text-[10px] text-slate-500">Teaching, Attendance & Marks</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    switchUserRole("FINANCE_OFFICER");
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-white">Finance Officer</div>
                    <div className="text-[10px] text-slate-500">Ledger, Challans & Approvals</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    switchUserRole("SUPER_ADMIN");
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-white">University Super Admin</div>
                    <div className="text-[10px] text-slate-500">Full Academic & System Config</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
              aria-label="View notifications (2 unread)"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                  Notifications
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700">
                  <div className="font-semibold text-royal-600">Fall 2026 Midterm Schedule</div>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Midterm examination schedule and room seating plans are now available.
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <div className="font-semibold text-emerald-600">Fee Challan Issued</div>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Your Fall 2026 semester fee challan is ready for download and payment.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Identification Display (matching reference portal) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                Welcome, {displayName}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {displayId}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-cyan-100 dark:ring-cyan-900">
              {initial}
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 ml-2 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-slate-500 hover:text-red-600" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

