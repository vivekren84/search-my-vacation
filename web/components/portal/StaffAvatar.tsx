"use client";

import React from "react";

export type AvatarPresetId = "monogram" | "compass" | "chinar" | "contour";

interface StaffAvatarProps {
  avatarUrl?: string | null;
  presetId?: AvatarPresetId;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const SIZE_MAP = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
  "2xl": "w-32 h-32 text-3xl",
};

export function StaffAvatar({
  avatarUrl,
  presetId = "monogram",
  name = "Advisor",
  size = "md",
  className = "",
}: StaffAvatarProps) {
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  // If a custom uploaded studio portrait exists, render image
  if (avatarUrl) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden border border-[#F5951C]/40 bg-[#09090B] shadow-sm shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fall back to preset SVG if image fails to load
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  // Fallback to executive SVG avatar preset
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden border border-[#F5951C]/40 bg-[#09090B] text-white shadow-sm shrink-0 select-none ${sizeClasses} ${className}`}
      title={`${name} (${presetId} avatar)`}
    >
      {renderPresetSvg(presetId, name)}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderPresetSvg(presetId: AvatarPresetId, name: string) {
  const initials = getInitials(name);

  switch (presetId) {
    case "compass":
      // Executive Compass Rose
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#141210" stroke="#F5951C" strokeWidth="1.5" strokeOpacity="0.4" />
          <circle cx="50" cy="50" r="40" stroke="#FFFFFF" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="2 3" />
          {/* Degree ticks */}
          <line x1="50" y1="6" x2="50" y2="10" stroke="#F5951C" strokeWidth="1.5" />
          <line x1="50" y1="90" x2="50" y2="94" stroke="#F5951C" strokeWidth="1.5" />
          <line x1="6" y1="50" x2="10" y2="50" stroke="#F5951C" strokeWidth="1.5" />
          <line x1="90" y1="50" x2="94" y2="50" stroke="#F5951C" strokeWidth="1.5" />
          {/* 8-point faceted compass star */}
          {/* North */}
          <polygon points="50,14 54,46 50,50" fill="#F5951C" />
          <polygon points="50,14 46,46 50,50" fill="#B72027" />
          {/* South */}
          <polygon points="50,86 46,54 50,50" fill="#E2E8F0" />
          <polygon points="50,86 54,54 50,50" fill="#94A3B8" />
          {/* East */}
          <polygon points="86,50 54,54 50,50" fill="#F5951C" />
          <polygon points="86,50 54,46 50,50" fill="#B72027" />
          {/* West */}
          <polygon points="14,50 46,46 50,50" fill="#E2E8F0" />
          <polygon points="14,50 46,54 50,50" fill="#94A3B8" />
          {/* Center Jewel */}
          <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" stroke="#F5951C" strokeWidth="1" />
        </svg>
      );

    case "chinar":
      // Executive Chinar Leaf (Atelier slow travel emblem)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#141210" stroke="#F5951C" strokeWidth="1.5" strokeOpacity="0.4" />
          <g transform="translate(10, 10) scale(0.8)">
            {/* Chinar leaf lobes */}
            <path
              d="M50 12 C52 24 64 26 68 22 C67 32 76 34 82 32 C78 42 86 46 88 52 C78 56 74 66 72 74 L54 70 L50 86 L46 70 L28 74 C26 66 22 56 12 52 C14 46 22 42 18 32 C24 34 33 32 32 22 C36 26 48 24 50 12 Z"
              fill="url(#chinarGradient)"
              stroke="#F5951C"
              strokeWidth="1.2"
            />
            {/* Vein lines */}
            <line x1="50" y1="18" x2="50" y2="72" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="50" y1="36" x2="72" y2="28" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="50" y1="36" x2="28" y2="28" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="50" y1="48" x2="76" y2="44" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="50" y1="48" x2="24" y2="44" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="50" y1="60" x2="68" y2="62" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="50" y1="60" x2="32" y2="62" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.5" />
          </g>
          <defs>
            <linearGradient id="chinarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5951C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#280336" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "contour":
      // Executive Horizon Contour (Topography / slow journeys)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#141210" stroke="#F5951C" strokeWidth="1.5" strokeOpacity="0.4" />
          {/* Sunset Horizon Sun Arc */}
          <circle cx="50" cy="38" r="16" fill="url(#sunGlow)" />
          {/* Mountain Ridges */}
          <path
            d="M8 72 Q 28 42, 50 54 T 92 68 L 92 92 L 8 92 Z"
            fill="#1E1B18"
            stroke="#F5951C"
            strokeWidth="1"
            strokeOpacity="0.7"
          />
          <path
            d="M8 80 Q 34 58, 62 70 T 92 78 L 92 92 L 8 92 Z"
            fill="#282420"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          <path
            d="M8 86 Q 42 74, 76 82 T 92 88 L 92 92 L 8 92 Z"
            fill="#09090B"
            stroke="#F5951C"
            strokeWidth="0.6"
            strokeOpacity="0.3"
          />
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5951C" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#F36523" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#280336" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    case "monogram":
    default:
      // Executive Monogram Crest with dynamic initials
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#141210" stroke="#F5951C" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="50" cy="50" r="40" stroke="#FFFFFF" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="3 2" />
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="var(--font-editorial), Georgia, serif"
            fontSize="32"
            fontWeight="bold"
            letterSpacing="1"
          >
            {initials}
          </text>
          {/* Subtle amber pip below */}
          <circle cx="50" cy="74" r="2" fill="#F5951C" />
        </svg>
      );
  }
}
