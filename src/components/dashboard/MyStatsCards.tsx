"use client";

import React from "react";
import Link from "next/link";
import { DollarSign, Award, BookOpen, UserCheck, ArrowUpRight } from "lucide-react";

interface MyStatsCardsProps {
  currentBalance?: number;
  cgpa?: number;
  registeredCourses?: number;
  averageAttendance?: number;
}

export function MyStatsCards({
  currentBalance = 222680.0,
  cgpa = 2.68,
  registeredCourses = 8,
  averageAttendance = 83.43,
}: MyStatsCardsProps) {
  const cards = [
    {
      title: "Current Balance",
      value: `(${currentBalance.toFixed(2)})`,
      subtitle: "PKR Payable",
      href: "/fees",
      bgClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
      textClass: "text-amber-800 dark:text-amber-200",
      valClass: "text-amber-900 dark:text-amber-100",
      icon: DollarSign,
      iconBg: "bg-amber-200/70 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
    },
    {
      title: "CGPA",
      value: `(${cgpa.toFixed(2)})`,
      subtitle: "Out of 4.00",
      href: "/transcript",
      bgClass: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
      textClass: "text-blue-800 dark:text-blue-200",
      valClass: "text-blue-900 dark:text-blue-100",
      icon: Award,
      iconBg: "bg-blue-200/70 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
    },
    {
      title: "Registered Courses",
      value: `(${registeredCourses.toFixed(2)})`,
      subtitle: "Fall 2026 Session",
      href: "/courses",
      bgClass: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
      textClass: "text-rose-800 dark:text-rose-200",
      valClass: "text-rose-900 dark:text-rose-100",
      icon: BookOpen,
      iconBg: "bg-rose-200/70 text-rose-900 dark:bg-rose-900 dark:text-rose-100",
    },
    {
      title: "Average Attendance",
      value: `(${averageAttendance.toFixed(2)})%`,
      subtitle: "Semester Compliance",
      href: "/attendance",
      bgClass: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/60",
      textClass: "text-teal-800 dark:text-teal-200",
      valClass: "text-teal-900 dark:text-teal-100",
      icon: UserCheck,
      iconBg: "bg-teal-200/70 text-teal-900 dark:bg-teal-900 dark:text-teal-100",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm mb-6">
      {/* Banner matching reference */}
      <div className="bg-rose-500 text-white px-5 py-2.5 font-bold text-sm tracking-wide flex items-center justify-between">
        <span>My Stats</span>
        <span className="text-xs font-normal text-rose-100">Fall 2026 Real-Time Academic Metrics</span>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className={`p-4 rounded-xl border transition-all hover:shadow-md group flex flex-col justify-between ${c.bgClass}`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div className="mt-4">
                <div className={`text-xs font-semibold uppercase tracking-wider ${c.textClass}`}>
                  {c.title}
                </div>
                <div className={`text-2xl font-black mt-1 tracking-tight ${c.valClass}`}>
                  {c.value}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.subtitle}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

