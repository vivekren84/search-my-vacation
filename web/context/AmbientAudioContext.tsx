"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export interface AmbientAudioContextValue {
  isMuted: boolean;
  isPlaying: boolean;
  isCrossFading: boolean;
  hasVisited: boolean;
  showDiscoveryTooltip: boolean;
  toggleMute: () => Promise<void>;
  unmute: () => Promise<void>;
  mute: () => Promise<void>;
  dismissDiscoveryTooltip: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AmbientAudioContext = createContext<AmbientAudioContextValue | null>(null);

const TARGET_VOLUME = 0.28;
const FADE_DURATION_MS = 800;
const FADE_STEPS = 20;
const STEP_INTERVAL_MS = FADE_DURATION_MS / FADE_STEPS; // 40ms per step
const STORAGE_STATE_KEY = "smv_soundscape_state";
const STORAGE_VISITED_KEY = "smv_soundscape_visited";
const LEGACY_MUTED_KEY = "smv_ambient_muted";

export function AmbientAudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const wasPlayingBeforeDuckingRef = useRef(false);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCrossFading, setIsCrossFading] = useState(false);
  const [hasVisited, setHasVisited] = useState(true);
  const [showDiscoveryTooltip, setShowDiscoveryTooltip] = useState(false);

  // Initialize state and discovery beacon from localStorage
  useEffect(() => {
    try {
      const visited = localStorage.getItem(STORAGE_VISITED_KEY);
      if (!visited) {
        setHasVisited(false);
        setShowDiscoveryTooltip(true);
      } else {
        setHasVisited(true);
        setShowDiscoveryTooltip(false);
      }

      const storedState = localStorage.getItem(STORAGE_STATE_KEY);
      const legacyMuted = localStorage.getItem(LEGACY_MUTED_KEY);
      if (storedState === "unmuted" && legacyMuted !== "true") {
        // User explicitly chose unmuted in a prior session
        setIsMuted(false);
      } else {
        setIsMuted(true);
      }
    } catch {
      // Graceful fallback for privacy/restricted browsing modes
    }
  }, []);

  // Auto-dismiss discovery tooltip after 7 seconds or on user scroll
  useEffect(() => {
    if (!showDiscoveryTooltip) return;

    const timer = window.setTimeout(() => {
      setShowDiscoveryTooltip(false);
      try {
        localStorage.setItem(STORAGE_VISITED_KEY, "true");
      } catch {
        // Safe fallback
      }
    }, 7000);

    const handleScroll = () => {
      setShowDiscoveryTooltip(false);
      try {
        localStorage.setItem(STORAGE_VISITED_KEY, "true");
      } catch {
        // Safe fallback
      }
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showDiscoveryTooltip]);

  const dismissDiscoveryTooltip = useCallback(() => {
    setShowDiscoveryTooltip(false);
    setHasVisited(true);
    try {
      localStorage.setItem(STORAGE_VISITED_KEY, "true");
    } catch {
      // Safe fallback
    }
  }, []);

  // Linear volume fade ramp utility
  const fadeVolume = useCallback((targetVol: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    setIsCrossFading(true);
    const initialVol = audio.volume;
    const volDelta = (targetVol - initialVol) / FADE_STEPS;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      if (!audioRef.current) {
        if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
        setIsCrossFading(false);
        return;
      }

      const nextVol = Math.max(0, Math.min(1, initialVol + volDelta * currentStep));
      audioRef.current.volume = nextVol;

      if (currentStep >= FADE_STEPS) {
        if (fadeIntervalRef.current) {
          window.clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        audioRef.current.volume = targetVol;
        setIsCrossFading(false);
        if (onComplete) onComplete();
      }
    }, STEP_INTERVAL_MS);
  }, []);

  const unmute = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    dismissDiscoveryTooltip();

    try {
      if (audio.paused) {
        audio.volume = 0.0;
        await audio.play();
        setIsPlaying(true);
      }

      setIsMuted(false);
      fadeVolume(TARGET_VOLUME);

      try {
        localStorage.setItem(STORAGE_STATE_KEY, "unmuted");
        localStorage.removeItem(LEGACY_MUTED_KEY);
      } catch {
        // Safe fallback
      }
    } catch (err) {
      console.warn("Audio playback gesture prevented by browser policy:", err);
      setIsPlaying(false);
      setIsMuted(true);
    }
  }, [dismissDiscoveryTooltip, fadeVolume]);

  const mute = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    dismissDiscoveryTooltip();
    setIsMuted(true);

    fadeVolume(0.0, () => {
      audio.pause();
      setIsPlaying(false);
    });

    try {
      localStorage.setItem(STORAGE_STATE_KEY, "muted");
      localStorage.setItem(LEGACY_MUTED_KEY, "true");
    } catch {
      // Safe fallback
    }
  }, [dismissDiscoveryTooltip, fadeVolume]);

  const toggleMute = useCallback(async () => {
    if (isMuted) {
      await unmute();
    } else {
      await mute();
    }
  }, [isMuted, mute, unmute]);

  // Page Visibility API lifecycle listener: duck audio when tab is hidden, resume on focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        // Tab backgrounded or screen locked
        if (!isMuted && isPlaying) {
          wasPlayingBeforeDuckingRef.current = true;
          fadeVolume(0.0, () => {
            audio.pause();
          });
        }
      } else {
        // Tab foregrounded
        if (wasPlayingBeforeDuckingRef.current && !isMuted) {
          wasPlayingBeforeDuckingRef.current = false;
          audio.volume = 0.0;
          audio.play().then(() => {
            setIsPlaying(true);
            fadeVolume(TARGET_VOLUME);
          }).catch(() => {
            // Autoplay safety catch
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fadeVolume, isMuted, isPlaying]);

  return (
    <AmbientAudioContext.Provider
      value={{
        isMuted,
        isPlaying,
        isCrossFading,
        hasVisited,
        showDiscoveryTooltip,
        toggleMute,
        unmute,
        mute,
        dismissDiscoveryTooltip,
        audioRef,
      }}
    >
      <audio
        ref={audioRef}
        src="/audio/smv-ambient-journey.mp3"
        preload="metadata"
        loop
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
      {children}
    </AmbientAudioContext.Provider>
  );
}

export function useAmbientAudio() {
  const context = useContext(AmbientAudioContext);
  if (!context) {
    throw new Error("useAmbientAudio must be used within an <AmbientAudioProvider>");
  }
  return context;
}
