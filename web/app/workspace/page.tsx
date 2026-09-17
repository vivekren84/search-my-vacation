import { signOutCurrentWorkspaceUser } from "@/lib/workspace/shared/auth/service";
import { requireWorkspaceUser } from "@/lib/workspace/shared/rbac/guard";
import { redirect } from "next/navigation";

// EBC-R1.3-WS11-007: SMV Workspace Foundation (WS-Eng-0).
// Temporary foundation-verification placeholder — not an approved screen.
// Confirms the authentication + route-protection + RBAC mechanism is wired
// end-to-end. Replaced by the approved Dashboard (out of scope for this EBC)
// in a later Engineering Phase.
export default async function WorkspaceFoundationPage() {
  const user = await requireWorkspaceUser();

  async function signOutAction() {
    "use server";
    await signOutCurrentWorkspaceUser();
    redirect("/workspace/sign-in");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold">SMV Workspace — Engineering Foundation</h1>
      <p className="mt-2 text-sm text-gray-600">
        Signed in as {user.email ?? user.id} ({user.role}).
      </p>
      <p className="mt-4 text-sm text-gray-500">
        This is a temporary verification placeholder (EBC-R1.3-WS11-007), not an approved screen.
      </p>
      <form action={signOutAction}>
        <button type="submit" className="mt-4 text-sm underline">
          Sign out
        </button>
      </form>
    </main>
  );
}
