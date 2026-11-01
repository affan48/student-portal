"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-semibold text-sm">Loading UIT University Portal...</p>
      </div>
    </div>
  );
}

