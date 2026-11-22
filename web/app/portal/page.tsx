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
    <div className="min-h-screen bg-[#2A211C] flex items-center justify-center text-white/70 text-sm">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#F5951C] border-t-transparent rounded-full animate-spin" />
        <span>Loading Search My Vacation Workspace...</span>
      </div>
    </div>
  );
}
