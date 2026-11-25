"use client";

import { useEffect, useRef, useState } from "react";

interface SessionIdleGuardProps {
  /** Idle threshold before showing the warning prompt (default: 30 minutes). */
  idleLimitMs?: number;
  /** Grace countdown duration once prompted (default: 2 minutes). */
  graceDurationSeconds?: number;
  /** Callback invoked when the user chooses Log Out or the grace countdown expires. */
  onLogout: () => void;
}

/**
 * Monitors staff session activity and prompts for explicit confirmation
 * after 30 minutes of inactivity with a 2-minute countdown before auto-logout.
 */
export function SessionIdleGuard({
  idleLimitMs = 30 * 60 * 1000,
  graceDurationSeconds = 120,
  onLogout,
}: SessionIdleGuardProps) {
  const lastActivityRef = useRef<number>(Date.now());
  const [showPrompt, setShowPrompt] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(graceDurationSeconds);
  const onLogoutRef = useRef(onLogout);
  onLogoutRef.current = onLogout;

  // Track user activity only while the warning modal is NOT open
  useEffect(() => {
    const handleActivity = () => {
      if (!showPrompt) {
        lastActivityRef.current = Date.now();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    const watchdogTimer = setInterval(() => {
      if (showPrompt) return;
      const idleTimeMs = Date.now() - lastActivityRef.current;
      if (idleTimeMs >= idleLimitMs) {
        setSecondsLeft(graceDurationSeconds);
        setShowPrompt(true);
      }
    }, 15000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearInterval(watchdogTimer);
    };
  }, [idleLimitMs, graceDurationSeconds, showPrompt]);

  // 2-minute countdown while warning modal is visible
  useEffect(() => {
    if (!showPrompt) return;

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowPrompt(false);
          onLogoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [showPrompt]);

  function handleStayOn() {
    lastActivityRef.current = Date.now();
    setSecondsLeft(graceDurationSeconds);
    setShowPrompt(false);
  }

  function handleConfirmLogout() {
    setShowPrompt(false);
    onLogoutRef.current();
  }

  if (!showPrompt) return null;

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121215] border border-[#E2E8F0] dark:border-white/20 rounded-2xl max-w-md w-full p-6 text-[#0F172A] dark:text-white shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
            ⏱️
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Session Inactivity Notice
            </h3>
            <p className="text-xs text-[#475569] dark:text-zinc-400 mt-1 leading-relaxed">
              Your session has been inactive for the last 30 minutes. It will end in the next 2 minutes. Please confirm if you would like to stay on.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#09090B] border border-[#E2E8F0] dark:border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#475569] dark:text-zinc-400">
            Auto-logout countdown
          </span>
          <span className="font-mono text-lg font-bold text-[#F5951C]">
            {mins}:{secs}
          </span>
        </div>

        <div className="flex justify-end items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="px-4 py-2 rounded-xl border border-[#CBD5E1] dark:border-white/15 text-xs font-semibold text-[#475569] dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            Log Out
          </button>
          <button
            type="button"
            onClick={handleStayOn}
            className="px-5 py-2 rounded-xl bg-[#F5951C] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#e08515] transition shadow-md"
          >
            Stay On
          </button>
        </div>
      </div>
    </div>
  );
}
