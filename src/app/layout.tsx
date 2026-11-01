import type { Metadata } from "next";
import "./globals.css";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "UIT University | Student Information & University Management System",
  description: "Enterprise Student Information & University Management System for UIT University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-scale-default">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AccessibilityProvider>
          <AuthProvider>{children}</AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}

