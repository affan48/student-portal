"use client";

import React from "react";
import { useAccessibility, FontSize } from "@/context/AccessibilityContext";
import { Sun, Moon, Eye, Type, RotateCcw } from "lucide-react";

export function AccessibilityBar() {
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    darkMode,
    setDarkMode,
    resetAccessibility,
  } = useAccessibility();

  const fontSizes: { label: string; value: FontSize; title: string }[] = [
    { label: "A-", value: "small", title: "Small font (14px)" },
    { label: "A", value: "default", title: "Default font (16px)" },
    { label: "A+", value: "large", title: "Large font (18px)" },
    { label: "A++", value: "xlarge", title: "Extra Large font (20px)" },
  ];

  return (
    <div
      role="region"
      aria-label="Accessibility controls"
      className="bg-navy-900 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-navy-800"
    >
      <div className="flex items-center gap-2 text-slate-300">
        <Eye className="w-3.5 h-3.5 text-royal-500" aria-hidden="true" />
        <span className="font-medium">Accessibility (WCAG 2.2 AA)</span>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {/* Font Size Scaling */}
        <div className="flex items-center gap-1" role="group" aria-label="Font size controls">
          <Type className="w-3.5 h-3.5 text-slate-400 mr-1" aria-hidden="true" />
          <span className="sr-only">Font Size:</span>
          {fontSizes.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFontSize(f.value)}
              title={f.title}
              aria-pressed={fontSize === f.value}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                fontSize === f.value
                  ? "bg-royal-600 text-white ring-1 ring-white"
                  : "bg-navy-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* High Contrast Toggle */}
        <button
          type="button"
          onClick={() => setHighContrast(!highContrast)}
          aria-pressed={highContrast}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
            highContrast
              ? "bg-yellow-400 text-black font-bold ring-2 ring-white"
              : "bg-navy-800 text-slate-300 hover:bg-slate-700"
          }`}
          title="Toggle High Contrast for weak eyesight"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
          <span>{highContrast ? "High Contrast: ON" : "High Contrast"}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          aria-pressed={darkMode}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-navy-800 text-slate-300 hover:bg-slate-700 transition-colors"
          title="Toggle Dark Mode"
        >
          {darkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Reset Settings */}
        <button
          type="button"
          onClick={resetAccessibility}
          title="Reset accessibility settings to default"
          className="text-slate-400 hover:text-white p-1 rounded"
          aria-label="Reset accessibility settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

