"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, StudentProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchUserRole: (role: "STUDENT" | "FACULTY" | "SUPER_ADMIN" | "FINANCE_OFFICER") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage or fetch current user
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const storedToken = localStorage.getItem("ums_token");
        if (storedToken) {
          setToken(storedToken);
          const res = await fetch("/api/v1/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setStudentProfile(data.studentProfile || null);
          } else {
            // Token expired or invalid
            localStorage.removeItem("ums_token");
            setToken(null);
            setUser(null);
          }
        } else {
          // Auto-login as reference student for immediate seamless experience
          await login("student@uit.edu", "Password123!");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  const login = async (email: string, password: string = "Password123!"): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      setToken(data.accessToken);
      localStorage.setItem("ums_token", data.accessToken);
      setUser(data.user);
      setStudentProfile(data.studentProfile || null);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("ums_token");
      setToken(null);
      setUser(null);
      setStudentProfile(null);
    }
  };

  const switchUserRole = async (role: "STUDENT" | "FACULTY" | "SUPER_ADMIN" | "FINANCE_OFFICER") => {
    const roleEmails = {
      STUDENT: "student@uit.edu",
      FACULTY: "faculty@uit.edu",
      SUPER_ADMIN: "admin@uit.edu",
      FINANCE_OFFICER: "finance@uit.edu",
    };
    await login(roleEmails[role], "Password123!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        token,
        isLoading,
        login,
        logout,
        switchUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

