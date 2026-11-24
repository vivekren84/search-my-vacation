"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if staff session exists
    const session = typeof window !== "undefined" ? localStorage.getItem("smv_staff_session") : null;
    if (session) {
      router.replace("/portal/dashboard");
    } else {
      router.replace("/portal/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] flex items-center justify-center text-[#0F172A] dark:text-white text-sm transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#F5951C] border-t-transparent rounded-full animate-spin" />
        <span className="font-medium text-[#475569] dark:text-zinc-400">Loading Search My Vacation Workspace...</span>
      </div>
    </div>
  );
}
