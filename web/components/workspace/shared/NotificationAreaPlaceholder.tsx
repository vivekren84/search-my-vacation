// EBC-R1.3-WS11-011: Workspace Dashboard Foundation, Scope item 2 names four
// permanent shell regions: "Left Navigation | Top Header | Main Content
// Area | Notification Area (placeholder)". This component is that fourth
// region — a real, named extension point rather than an omission, per
// Product Ratification #5 ("subsequent EBCs shall extend this shell rather
// than replace or redesign it").
//
// It renders nothing visible for Release 1.3: the Notifications engine
// itself is explicitly Out of Scope for this EBC, and Vivek's Product
// ratification (17 September 2026, resolving this EBC's navigation
// escalation) confirms Notifications is surfaced only through the header
// bell icon, not a persistent rail or panel — a permanently visible empty
// panel on every screen would also work against the "calm, professional"
// UX requirement before there is any real content to show in it. A future
// Notifications EBC gives this slot real content without altering
// WorkspaceShell itself.
export default function NotificationAreaPlaceholder() {
  return <div data-workspace-region="notification-area" aria-hidden="true" className="hidden" />;
}
