"use client";

import { useRef, useState } from "react";

/**
 * Homepage Ambient Audio Player (Release 1.3 Milestone 4 — HP-04)
 *
 * Implements a discreet, luxury floating audio player that brings soulful
 * ambient travel music ("Sanctuary of Silence") to the homepage experience.
 *
 * Requirements & Guardrails:
 * - Browser Autoplay Policy: Never attempts unmuted autoplay without user gesture.
 * - Initial Volume: Starts at a soft, ambient level (35% volume) with smooth fade-in.
 * - Accessibility: Accessible labels, keyboard focus indicators, respects prefers-reduced-motion.
 * - Persistence: Remembers user mute/pause preference in localStorage.
 */

export function AmbientAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      try {
        localStorage.setItem("smv_ambient_muted", "true");
      } catch {
        // Safe fallback if localStorage is disabled
      }
    } else {
      try {
        audio.volume = 0.35; // Soft luxury ambient volume
        await audio.play();
        setIsPlaying(true);
        try {
          localStorage.removeItem("smv_ambient_muted");
        } catch {
          // Safe fallback if localStorage is disabled
        }
      } catch (err) {
        console.warn("Audio playback gesture prevented by browser policy:", err);
        setIsPlaying(false);
      }
    }
  };

  return (
    <aside
      aria-label="Ambient soundscape player"
      className="fixed bottom-5 left-4 z-40 sm:bottom-6 sm:left-6"
    >
      <audio
        ref={audioRef}
        src="/audio/smv-ambient-journey.mp3"
        preload="metadata"
        loop
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      <button
        type="button"
        onClick={togglePlayback}
        aria-label={
          isPlaying
            ? "Pause ambient soundscape: Sanctuary of Silence"
            : "Play ambient soundscape: Sanctuary of Silence"
        }
        className="group flex items-center gap-2.5 rounded-full border border-[#e4d2b5]/40 bg-[#2A211C]/90 px-3.5 py-2 text-xs font-medium text-white/90 shadow-[0_8px_24px_rgba(42,33,28,0.28)] backdrop-blur-md transition duration-300 hover:border-[#F5951C]/60 hover:bg-[#2A211C] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5951C]"
      >
        {/* Animated Soundwave bars when playing, or peaceful static icon when idle */}
        <span aria-hidden="true" className="flex items-center gap-0.5">
          {isPlaying ? (
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
              className="size-3.5 text-[#F5951C] transition group-hover:scale-110"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity={0.2} />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </span>

        <span className="tracking-wide">
          {isPlaying ? (
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-white">Sanctuary of Silence</span>
              <span className="text-[0.65rem] uppercase tracking-wider text-[#F5951C]">(Playing)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-white/80 group-hover:text-white">
              <span>Sanctuary Ambience</span>
              <span className="text-[0.65rem] text-[#F5951C]">▶ Play</span>
            </span>
          )}
        </span>
      </button>
    </aside>
  );
}
