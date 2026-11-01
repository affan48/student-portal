"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, GraduationCap, Shield, BookOpen, DollarSign, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("student@uit.edu");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const setRoleCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-11 rounded-full border-2 border-royal-700 bg-white flex items-center justify-center mx-auto shadow-sm">
            <span className="text-royal-800 font-black text-sm tracking-widest">UIT</span>
          </div>
          <h1 className="text-xl font-black text-navy-900 dark:text-white tracking-tight">
            UIT UNIVERSITY
          </h1>
          <p className="text-xs font-semibold text-royal-600 dark:text-royal-400 uppercase tracking-wider">
            Student Information & University Management System
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <span>{loading ? "Authenticating..." : "Sign In to EDU Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Instant-Role Demo Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
            One-Click Demo Credentials
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRoleCredentials("student@uit.edu")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-royal-600 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-slate-800 dark:text-white truncate">Affan Ahmed</div>
                <div className="text-[10px] text-slate-500">Student</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRoleCredentials("faculty@uit.edu")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-slate-800 dark:text-white truncate">Faculty Member</div>
                <div className="text-[10px] text-slate-500">Instructor</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRoleCredentials("finance@uit.edu")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-slate-800 dark:text-white truncate">Finance Officer</div>
                <div className="text-[10px] text-slate-500">Accounts</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRoleCredentials("admin@uit.edu")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-slate-800 dark:text-white truncate">Super Admin</div>
                <div className="text-[10px] text-slate-500">Administrator</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

