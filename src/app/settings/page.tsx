"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAccessibility, FontSize } from "@/context/AccessibilityContext";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { Settings, Eye, Type, Sun, Moon, Lock, User, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    darkMode,
    setDarkMode,
    reducedMotion,
    setReducedMotion,
    resetAccessibility,
  } = useAccessibility();

  const { user, studentProfile } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [updatingPwd, setUpdatingPwd] = useState(false);

  const fontOptions: { label: string; value: FontSize; desc: string }[] = [
    { label: "Small (14px)", value: "small", desc: "Compact view with higher data density" },
    { label: "Default (16px)", value: "default", desc: "Standard WCAG 2.2 AA compliant typography" },
    { label: "Large (18px)", value: "large", desc: "Enhanced clarity for readability needs" },
    { label: "Extra Large (20px)", value: "xlarge", desc: "Maximum scale for low vision assistance" },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: "New passwords do not match", type: "error" });
      return;
    }

    try {
      setUpdatingPwd(true);
      setPwdMsg(null);
      await apiService.auth.changePassword({ currentPassword, newPassword });
      setPwdMsg({ text: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwdMsg({ text: err.message || "Failed to update password", type: "error" });
    } finally {
      setUpdatingPwd(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-royal-600" />
          <span>Accessibility & Account Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize UI scale, contrast, vision assistance, and security settings
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Accessibility Suite (WCAG 2.2 AA) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-royal-600" />
              <span>Vision & Accessibility Suite (WCAG 2.2 AA)</span>
            </h2>

            <button
              type="button"
              onClick={resetAccessibility}
              className="text-xs font-semibold text-royal-600 hover:underline"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Global Font-Size Controls */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Global Font Sizing
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {fontOptions.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFontSize(f.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    fontSize === f.value
                      ? "bg-royal-50 dark:bg-royal-950/40 border-royal-600 ring-2 ring-royal-600 text-royal-900 dark:text-royal-100"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="font-bold text-xs">{f.label}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast & Dark Mode Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  High Contrast Mode
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Stark borders & bold text</div>
              </div>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  highContrast
                    ? "bg-yellow-400 text-black font-extrabold"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                {highContrast ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Theme Mode</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Toggle dark background</div>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                {darkMode ? "Dark Theme" : "Light Theme"}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Reduce Motion
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Disable transitions</div>
              </div>
              <button
                type="button"
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  reducedMotion
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                {reducedMotion ? "Active" : "Off"}
              </button>
            </div>
          </div>
        </div>

        {/* 2. User Profile Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <User className="w-4 h-4 text-royal-600" />
            <span>Profile & Institutional Identification</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-medium">Full Legal Name:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-medium">Registration Number:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {studentProfile?.registrationNo || "23SP-052-SE"}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-medium">Enrollment Number:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {studentProfile?.enrollmentNo || "UITU-23SP-UGRAD-00236"}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-medium">Registered Email:</span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Security: Change Password */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4 max-w-xl">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Lock className="w-4 h-4 text-royal-600" />
            <span>Update Account Password</span>
          </h2>

          {pwdMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold ${
                pwdMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                  : "bg-rose-50 text-rose-800 border border-rose-300"
              }`}
            >
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPwd}
              className="px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
            >
              {updatingPwd ? "Updating..." : "Save New Password"}
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}

