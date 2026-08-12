export type JourneyMoodIllustrationName =
  | "relax"
  | "explore"
  | "celebrate"
  | "romance"
  | "escape"
  | "memory";

type JourneyMoodIllustrationProps = {
  name: JourneyMoodIllustrationName;
};

const primary = "var(--color-aubergine)";
const accent = "var(--color-amber)";

function Artwork({ children, strokeWidth }: { children: React.ReactNode; strokeWidth: number }) {
  return (
    <svg
      aria-hidden="true"
      className="h-24 w-40 overflow-visible"
      focusable="false"
      viewBox="0 0 180 104"
    >
      <g
        fill="none"
        stroke={primary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      >
        {children}
      </g>
    </svg>
  );
}

export default function JourneyMoodIllustration({ name }: JourneyMoodIllustrationProps) {
  switch (name) {
    case "relax":
      return (
        <Artwork strokeWidth={1.8}>
          <path d="M24 86c1-18 2-39 9-62M156 86c-1-18-2-39-9-62" />
          <path d="M33 24c-8 3-13 9-17 17M34 30c8-5 15-7 22-5M147 24c8 3 13 9 17 17M146 30c-8-5-15-7-22-5" opacity=".72" />
          <path d="M22 36c5-5 10-7 15-7M158 36c-5-5-10-7-15-7" opacity=".46" />
          <path d="M31 39 61 65c17 13 41 13 58 0l30-26" />
          <path d="M61 65c9 13 49 13 58 0M56 61c13 9 55 9 68 0" />
          <path d="M58 28c19-11 35 8 54-1 8-4 14-4 21-2M69 35c14-7 25 4 37 0" opacity=".72" />
          <path d="M18 85c32-5 50 2 72 0 29-3 48-4 72 0M24 92c25-4 42 2 64 0 28-3 48-3 68 0" opacity=".5" />
          <path d="M34 25c-6 7-8 15-9 24M146 25c6 7 8 15 9 24" opacity=".52" />
          <path d="M120 27c6-5 11-4 14-1-5 5-10 6-14 1Z" fill={accent} stroke={accent} />
        </Artwork>
      );

    case "explore":
      return (
        <Artwork strokeWidth={1.55}>
          <path d="m47 37 39-25 46 29M66 38l20-26 18 27" />
          <path d="M16 50 43 33l17 10M116 35l19-13 29 28" opacity=".48" />
          <path d="M61 31 73 24M105 32l12-8M16 57c18-5 31-5 44-2M124 55c15-4 27-4 40 0" opacity=".42" />
          <path d="M34 98c26-5 25-24 53-30 20-4 31-16 16-27" />
          <path d="M145 98c-30-8-42-21-56-24-17-4-18-14-5-22 8-5 17-7 19-11" />
          <path d="M89 95c-7-11-5-18 3-23 13-8 22-14 15-25" opacity=".5" strokeDasharray="3 5" />
          <path d="M27 78h18M36 69v18M31 73l10 10M41 73 31 83" opacity=".66" />
          <path d="M20 93l5-6m1 7 4-8m123 8-4-8m10 7-5-7" opacity=".48" />
          <circle cx="100" cy="57" r="3.4" fill={accent} stroke={accent} />
        </Artwork>
      );

    case "celebrate":
      return (
        <Artwork strokeWidth={1.75}>
          <path d="M15 80c18-5 31-4 44 0M121 80c15-5 29-5 44 0M16 88c22-4 38-3 55 1M109 89c18-4 35-4 55 0" opacity=".42" />
          <path d="M23 73h17l5-7 6 7M139 73v-16m-7 16h14m-11-16h8l-4-7Z" opacity=".58" />
          <path d="M48 31h32c0 22-4 34-16 34S48 53 48 31Z" />
          <path d="M100 31h32c0 22-4 34-16 34s-16-12-16-34Z" />
          <path d="M64 65v20M116 65v20M53 86h22M105 86h22" />
          <path d="M51 46c8 3 18 3 26 0M103 46c8 3 18 3 26 0" opacity=".58" />
          <path d="M90 19V7M82 20l-5-10M98 20l5-10M76 25l-9-5M104 25l9-5" opacity=".76" />
          <path d="m90 17 2.5 5.5L98 25l-5.5 2.5L90 33l-2.5-5.5L82 25l5.5-2.5Z" fill={accent} stroke={accent} />
        </Artwork>
      );

    case "romance":
      return (
        <Artwork strokeWidth={1.85}>
          <path d="M16 52c18-9 32-8 48 0 9 5 17 5 26 1 9 4 17 4 26-1 16-8 30-9 48 0" opacity=".44" />
          <path d="M15 64c20-7 36-7 52-1 9 3 16 4 23 1 7 3 14 2 23-1 16-6 32-6 52 1" opacity=".55" />
          <path d="M22 95c18-16 34-18 51-20 9-1 12-7 13-16 1-10 0-18 0-28" />
          <path d="M158 95c-18-16-34-18-51-20-9-1-12-7-13-16-1-10 0-18 0-28" />
          <path d="M18 75c17-5 30-6 44-3M118 72c16-3 29-2 44 3" opacity=".48" />
          <path d="M67 43c8-5 15-6 23-4 8-2 15-1 23 4M29 86l6-5m109 5 6-5" opacity=".62" />
          <path d="m80 31 10-7 10 7v8H80Z" />
          <path d="M90 16a11 11 0 0 1 11 11H79a11 11 0 0 1 11-11Z" fill={accent} stroke={accent} />
        </Artwork>
      );

    case "escape":
      return (
        <Artwork strokeWidth={1.55}>
          <path d="m16 39 24-18 17 12 20-21 15 14M111 30l17-15 36 28" opacity=".46" />
          <path d="m23 48 31-26 24 18 24-31 47 39" />
          <path d="M18 54c17-5 32-4 48 0 16 4 30 4 46 0 17-5 32-5 50 1" opacity=".5" />
          <path d="M45 99c28-7 33-22 50-27 18-5 20-14 13-24" />
          <path d="M137 99c-26-9-32-19-44-22-16-4-18-13-7-20 8-5 16-6 22-9" />
          <path d="M91 96c-5-9-3-16 5-21 13-8 19-15 13-23" opacity=".48" strokeDasharray="4 6" />
          <path d="M30 64v22M24 86h12M30 57l-8 12h16Z" />
          <path d="M149 65v21M143 86h12M149 57l-8 12h16Z" />
          <path d="M126 72v16M121 88h10M17 94l5-6m140 6-5-6" />
          <rect x="122.5" y="68" width="7" height="11" rx="2" fill={accent} stroke={accent} />
        </Artwork>
      );

    case "memory":
      return (
        <Artwork strokeWidth={1.6}>
          <path d="M18 23c25-7 50-3 72 9v60C68 80 43 77 18 84V23Z" />
          <path d="M162 23c-25-7-50-3-72 9v60c22-12 47-15 72-8V23Z" />
          <path d="m29 48 15-12 11 9 13-15 12 17M29 52c13-6 27-6 42 0M35 58c11-4 21-4 31 0" opacity=".58" />
          <path d="M108 70c9-12 21-19 40-24M126 43l11-8 11 8v9M116 60c11-4 23-3 35 2" />
          <path d="M31 70c9-7 17-8 26-3 7 4 12 4 20 0M30 76c17-4 33-3 48 2" opacity=".58" />
          <path d="M104 78c15-5 31-4 48 1M105 84c12-3 24-3 36 0" opacity=".46" />
          <path d="M90 32v64c4 0 7 3 9 7" stroke={accent} strokeWidth="2.4" />
          <path d="m99 103-1-9 7 5Z" fill={accent} stroke={accent} />
        </Artwork>
      );
  }
}
