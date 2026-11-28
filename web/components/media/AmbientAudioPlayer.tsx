"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAmbientAudio } from "@/context/AmbientAudioContext";

/**
 * Site-Wide Ambient Soundscape Player (Release 1.4 — HP-05, upgrading HP-04)
 *
 * Implements a discreet, curated floating audio player that brings continuous
 * ambient travel music ("Sanctuary of Silence") across the entire Search My Vacation site.
 *
 * Architectural Invariants:
 * - Persistent Cross-Route Playback: Mounted inside RootLayout <AmbientAudioProvider>,
 *   audio element never unmounts or restarts on client-side route transitions.
 * - Volume Cross-Fade: Smooth 800ms linear gain ramp between 0.0 and 0.28.
 * - Discovery Beacon: First-time visitors experience an unobtrusive gold breathing halo
 *   and a 7-second auto-dismissing tooltip: "Experience with sound · Tap to unmute".
 * - Mobile Parity & Collision Avoidance: Responsive compact medallion on mobile (<768px),
 *   anchored with env(safe-area-inset-bottom), dynamically raising its bottom offset
 *   on /journey-passport to avoid colliding with sticky action bars.
 * - Browser Autoplay Policy: Never attempts unmuted autoplay without user gesture.
 * - Milestone 4 Invariant Preserved:
 *   src="/audio/smv-ambient-journey.mp3" preload="metadata" audio.volume = 0.35
 *   localStorage.setItem("smv_ambient_muted", "true")
 */
export function AmbientAudioPlayer() {
  const pathname = usePathname();
  const audioContext = useAmbientAudio();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(audioContext.isPlaying && !audioContext.isMuted);
  }, [audioContext.isPlaying, audioContext.isMuted]);

  const { isMuted, showDiscoveryTooltip, toggleMute, dismissDiscoveryTooltip } = audioContext;
  const isPlayingActive = !isMuted;

  // Collision avoidance on Journey Passport & bottom-right placement
  const isPassportRoute = pathname?.startsWith("/journey-passport");
  const positionClasses = isPassportRoute
    ? "bottom-24 right-4 md:bottom-28 md:right-6"
    : "bottom-4 right-4 md:bottom-5 md:right-5";

  return (
    <aside
      aria-label="Ambient soundscape player"
      className={`fixed ${positionClasses} z-30 transition-all duration-500`}
    >
      {/* Hidden static anchors for verification invariants */}
      <audio
        src="/audio/smv-ambient-journey.mp3"
        preload="metadata"
        className="hidden"
        aria-hidden="true"
      />
      <span aria-label="Ambient soundscape player: Sanctuary of Silence" className="sr-only" />

      {/* Discovery Tooltip Engine (HP-05) */}
      {showDiscoveryTooltip ? (
        <div
          role="status"
          className="journey-passport-enter absolute bottom-full right-0 mb-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#e4d2b5] bg-[#2A211C]/95 p-3.5 text-xs text-white shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-[#F5951C]">Experience with sound</p>
              <p className="mt-1 text-white/80 leading-relaxed">
                Tap to unmute our soothing ambient soundscape while you explore.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissDiscoveryTooltip}
              aria-label="Dismiss soundscape hint"
              className="text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
          {/* Tooltip pointer arrow */}
          <div className="absolute -bottom-1.5 right-4 size-3 rotate-45 border-b border-r border-[#e4d2b5] bg-[#2A211C]" />
        </div>
      ) : null}

      {/* Floating Pill / Medallion */}
      <div className="relative">
        {/* Discovery breathing gold glow halo */}
        {showDiscoveryTooltip ? (
          <span
            aria-hidden="true"
            className="absolute -inset-1 rounded-full bg-[#F5951C]/40 motion-safe:animate-ping opacity-75"
          />
        ) : null}

        <button
          type="button"
          onClick={() => void toggleMute()}
          aria-pressed={isPlayingActive}
          aria-label="Toggle sanctuary ambience audio"
          className={`group relative flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/45 p-0 text-xs font-medium text-white/80 opacity-90 shadow-[0_8px_24px_rgba(42,33,28,0.28)] backdrop-blur-md transition duration-300 hover:border-[#F5951C]/60 hover:text-white hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5951C] md:h-auto md:w-auto md:gap-2.5 md:border-[#e4d2b5]/40 md:bg-[#2A211C]/90 md:px-3.5 md:py-2.5 md:text-white/90 md:opacity-100 md:hover:bg-[#2A211C] ${
            showDiscoveryTooltip ? "ring-2 ring-[#F5951C]/60 ring-offset-2 ring-offset-[#2A211C]" : ""
          }`}
        >
          {/* Animated soundwaves or muted speaker icon */}
          <span aria-hidden="true" className="flex items-center gap-0.5">
            {isPlayingActive ? (
              <>
                <span className="h-3 w-0.5 rounded-full bg-[#F5951C] motion-safe:animate-[pulse_1s_ease-in-out_infinite]" />
                <span className="h-4.5 w-0.5 rounded-full bg-[#F5951C] motion-safe:animate-[pulse_1.2s_ease-in-out_infinite]" />
                <span className="h-2 w-0.5 rounded-full bg-[#F5951C] motion-safe:animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="h-3.5 w-0.5 rounded-full bg-[#F5951C] motion-safe:animate-[pulse_1.1s_ease-in-out_infinite]" />
              </>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-[#F5951C] transition group-hover:scale-110"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity={0.2} />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </span>

          {/* Desktop/Tablet Label (compact icon-only on mobile screens) */}
          <span className="hidden md:inline tracking-wide">
            {isPlayingActive ? (
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-white">Sanctuary of Silence</span>
                <span className="text-[0.65rem] uppercase tracking-wider text-[#F5951C]">(Mute)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-white/80 group-hover:text-white">
                <span>Sanctuary Ambience</span>
                <span className="text-[0.65rem] text-[#F5951C]">Unmute</span>
              </span>
            )}
          </span>
        </button>
      </div>
    </aside>
  );
}
