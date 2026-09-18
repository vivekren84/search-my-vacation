// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 9. The
// fourth action's fifth sibling — "My Work" — was missing from this EBC's
// own literal list (only four named) even though the Product Specification
// (§6.1) and Baseline Handover (§5.1) both record five as approved; the
// exact fifth name was not recoverable from any committed document (Rad
// confirmed this via repository search before escalating). Vivek, Product
// Owner, ratified "My Work" as the fifth action on 17 September 2026,
// describing it as a future personalised work-queue entry point — a
// placeholder only for this EBC, exactly like the other four.
//
// EBC-R1.3-WS11-011D: Workspace UX Visual Refinement Implementation
// (WS11A-01 Mandatory; WS11A-15 Recommended, per EBC-R1.3-WS11-011B §14).
// The five labels and their order are unchanged. The first action ("New
// Lead") now renders as the single primary, amber-filled action —
// reflecting the approved "Inquiry First" design principle — with the
// remaining four as warm-outline secondary actions.
const WORKSPACE_QUICK_ACTIONS: readonly string[] = [
  "New Lead",
  "Create Journey",
  "Add Traveller",
  "New Vendor",
  "My Work",
];

export default function QuickActions() {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border-warm)] bg-white p-5 shadow-[var(--shadow-sm)]">
      <h2 className="font-serif text-lg text-[var(--color-espresso)]">Quick Actions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {WORKSPACE_QUICK_ACTIONS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={
              index === 0
                ? "rounded-full border border-[var(--color-amber)] bg-[var(--color-amber)] px-4 py-2 text-sm font-semibold text-[var(--color-espresso)] transition hover:bg-[#e88a16]"
                : "rounded-full border border-[var(--color-border-warm)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-espresso)] transition hover:bg-[rgb(245_149_28_/_8%)]"
            }
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
