// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 6. The EBC's
// own example ("Good Morning," alongside "Here's what's happening today")
// reads as a time-of-day greeting rather than fixed text, so this derives
// Good Morning / Good Afternoon / Good Evening from the server's clock at
// render time. Disclosed judgment call (implementation report, Section on
// judgment calls): no traveller/staff timezone preference exists yet
// anywhere in the Workspace data model, so this uses the server's local
// time, not the signed-in user's — a reasonable stand-in, not asserted as
// the final design.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-01, Mandatory, per EBC-R1.3-WS11-011B §14). Colour tokens only —
// the greeting logic above is unchanged.
function greetingForHour(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

type WelcomeSectionProps = { displayName: string };

export default function WelcomeSection({ displayName }: WelcomeSectionProps) {
  const greeting = greetingForHour(new Date().getHours());

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-amber)]">{greeting},</p>
      <h1 className="mt-1 font-serif text-2xl text-[var(--color-espresso)] sm:text-3xl">Welcome back, {displayName}</h1>
      <p className="mt-1 text-sm text-[var(--color-espresso)]/60">Here&rsquo;s what&rsquo;s happening today.</p>
    </div>
  );
}
