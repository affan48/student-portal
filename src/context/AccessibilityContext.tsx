"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FontSize = "small" | "default" | "large" | "xlarge";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("default");
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem("ums_font_size") as FontSize;
      if (savedFont && ["small", "default", "large", "xlarge"].includes(savedFont)) {
        setFontSizeState(savedFont);
      }

      const savedContrast = localStorage.getItem("ums_high_contrast") === "true";
      setHighContrastState(savedContrast);

      const savedDark = localStorage.getItem("ums_dark_mode") === "true";
      setDarkModeState(savedDark);

      const savedMotion = localStorage.getItem("ums_reduce_motion") === "true";
      setReducedMotionState(savedMotion);
    } catch {
      // ignore in environments without localStorage
    }
  }, []);

  // Sync to HTML element classes
  useEffect(() => {
    const root = document.documentElement;

    // Font size scaling
    root.classList.remove("text-scale-small", "text-scale-default", "text-scale-large", "text-scale-xlarge");
    root.classList.add(`text-scale-${fontSize}`);

    // High Contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Dark Mode
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Reduce Motion
    if (reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [fontSize, highContrast, darkMode, reducedMotion]);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem("ums_font_size", size);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem("ums_high_contrast", String(enabled));
  };

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled);
    localStorage.setItem("ums_dark_mode", String(enabled));
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    localStorage.setItem("ums_reduce_motion", String(enabled));
  };

  const resetAccessibility = () => {
    setFontSize("default");
    setHighContrast(false);
    setDarkMode(false);
    setReducedMotion(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        darkMode,
        setDarkMode,
        reducedMotion,
        setReducedMotion,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}

