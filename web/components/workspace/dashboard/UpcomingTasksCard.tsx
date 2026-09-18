import EmptyState from "@/components/workspace/shared/EmptyState";

// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 8.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-01/WS11A-02 Mandatory; WS11A-14 Mandatory, per
// EBC-R1.3-WS11-011B §14). Card tokens and heading typography refined; the
// empty-state copy below replaces the previous generic sentence with the
// approved Workspace Empty State Library §3.2 wording.
export default function UpcomingTasksCard() {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border-warm)] bg-white p-5 shadow-[var(--shadow-sm)]">
      <h2 className="font-serif text-lg text-[var(--color-espresso)]">Upcoming Tasks</h2>
      <div className="mt-3">
        <EmptyState
          icon={
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7.5 7.5 0 0 0 21 12.79Z" />
            </svg>
          }
          title="You're all caught up."
          description="Follow-ups and reminders tied to your Inquiries and Journeys will surface here as soon as they're scheduled."
        />
      </div>
    </section>
  );
}
