"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { AccessibilityBar } from "@/components/layout/AccessibilityBar";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Accessibility Bar */}
      <AccessibilityBar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader onToggleSidebar={() => setSidebarOpen(true)} />

          <main id="main-content" tabIndex={-1} className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Footer */}
          <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <div>
              UIT University © 2026. All rights reserved. • ISO 9001 Certified Academic Management
            </div>
            <div className="font-semibold text-royal-600 dark:text-royal-400">
              eDU SMARTZ Enterprise Portal
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

