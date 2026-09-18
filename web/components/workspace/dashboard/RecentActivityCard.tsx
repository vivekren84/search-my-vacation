import EmptyState from "@/components/workspace/shared/EmptyState";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 7.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-01/WS11A-02 Mandatory; WS11A-14 Mandatory, per
// EBC-R1.3-WS11-011B §14). Card tokens and heading typography refined; the
// empty-state copy below replaces the previous generic sentence with the
// approved Workspace Empty State Library §3.1 wording. This remains the
// only state this card can be in for Release 1.3 — no data source exists
// yet to populate it (Out of Scope: Live dashboard data).
export default function RecentActivityCard() {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border-warm)] bg-white p-5 shadow-[var(--shadow-sm)]">
      <h2 className="font-serif text-lg text-[var(--color-espresso)]">Recent Activity</h2>
      <div className="mt-3">
        <EmptyState
          icon={
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <circle cx="12" cy="12" r="8.25" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 1.5" />
            </svg>
          }
          title="Nothing has happened here yet."
          description="As your team claims Inquiries, builds proposals and confirms Journeys, their activity will appear here — so you always know what's moved since you last looked."
        />
      </div>
    </section>
  );
}
