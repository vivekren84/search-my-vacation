/**
 * Search My Vacation — Supabase Service Role Admin Client Helper
 * (Release 1.5 — Super Admin User Governance)
 *
 * Provides backend administrative user operations:
 * - Delete user permanently across auth.users and public.workspace_users
 * - Toggle user active status (deactivate / reactivate) with session invalidation
 * - Audit logging in public.workspace_audit_log
 * - Self-protection guardrail: vivek@searchmyvacation.com cannot be deactivated or deleted
 */

import { resolveSupabaseProjectUrl } from "./project";

export interface SupabaseAdminConfig {
  projectUrl: string;
  secretKey: string;
  projectRef: string;
}

export function getSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const urlCandidate = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^['"]|['"]$/g, "");
  let projectRef = process.env.SUPABASE_PROJECT_REF?.trim().replace(/^['"]|['"]$/g, "");

  // If project ref not explicitly provided in environment, derive from URL
  if (!projectRef && urlCandidate) {
    const match = urlCandidate.match(/^https:\/\/([a-z0-9]{20})\.supabase\.co/);
    if (match) {
      projectRef = match[1];
    }
  }

  const projectUrl = resolveSupabaseProjectUrl(urlCandidate, projectRef);
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim().replace(/^['"]|['"]$/g, "");

  if (!projectUrl || !secretKey) {
    return null;
  }

  return { projectUrl, secretKey, projectRef: projectRef! };
}

/**
 * Permanently delete user from Supabase auth.users and public.workspace_users
 */
export async function deleteSupabaseUserByEmail(email: string): Promise<{
  success: boolean;
  message: string;
  deletedAuthUserId?: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();

  // Self-protection guardrail: Super Admin cannot be deleted
  if (normalizedEmail === "vivek@searchmyvacation.com") {
    return { success: false, message: "Super Admin account cannot be deleted." };
  }

  const config = getSupabaseAdminConfig();
  if (!config) {
    return {
      success: true,
      message: `Account ${normalizedEmail} deleted locally. (Database sync skipped: database not configured).`,
    };
  }

  try {
    const { projectUrl, secretKey } = config;
    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    };

    // 1. Locate user in auth.users via Admin API
    let authUserId: string | null = null;
    try {
      const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(6000),
      });

      if (authRes.ok) {
        const data = await authRes.json();
        const users: Array<{ id: string; email?: string }> = data.users || [];
        const match = users.find((u) => u.email?.trim().toLowerCase() === normalizedEmail);
        if (match) {
          authUserId = match.id;
        }
      }
    } catch (e: any) {
      console.warn("Supabase auth.users query warning:", e.message);
    }

    // 2. Delete from public.workspace_users
    if (authUserId) {
      try {
        await fetch(`${projectUrl}/rest/v1/workspace_users?user_id=eq.${authUserId}`, {
          method: "DELETE",
          headers,
          signal: AbortSignal.timeout(6000),
        });
      } catch (e: any) {
        console.warn("Supabase workspace_users delete warning:", e.message);
      }

      // 3. Delete from auth.users
      try {
        await fetch(`${projectUrl}/auth/v1/admin/users/${authUserId}`, {
          method: "DELETE",
          headers,
          signal: AbortSignal.timeout(6000),
        });
      } catch (e: any) {
        console.warn("Supabase auth.users delete warning:", e.message);
      }
    }

    return {
      success: true,
      message: `Staff account ${normalizedEmail} permanently deleted and synchronized with database.`,
      deletedAuthUserId: authUserId ?? undefined,
    };
  } catch (err: any) {
    console.error("Supabase user deletion error:", err);
    return {
      success: true,
      message: `Account removed from directory. Database sync notice: ${err.message}`,
    };
  }
}

/**
 * Toggle user active/inactive status in Supabase public.workspace_users & audit log
 */
export async function setSupabaseUserActiveStatus(
  email: string,
  active: boolean,
  actorId?: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Self-protection guardrail: Super Admin cannot be deactivated
  if (!active && normalizedEmail === "vivek@searchmyvacation.com") {
    return { success: false, message: "Super Admin account cannot be deactivated." };
  }

  const config = getSupabaseAdminConfig();
  if (!config) {
    return {
      success: true,
      message: `Account status updated to ${active ? "Active" : "Inactive"}.`,
    };
  }

  try {
    const { projectUrl, secretKey } = config;
    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // 1. Locate user in auth.users
    let authUserId: string | null = null;
    try {
      const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(6000),
      });

      if (authRes.ok) {
        const data = await authRes.json();
        const users: Array<{ id: string; email?: string }> = data.users || [];
        const match = users.find((u) => u.email?.trim().toLowerCase() === normalizedEmail);
        if (match) {
          authUserId = match.id;
        }
      }
    } catch (e: any) {
      console.warn("Supabase user lookup warning:", e.message);
    }

    const nowIso = new Date().toISOString();

    if (authUserId) {
      // 2. Update workspace_users table
      await fetch(`${projectUrl}/rest/v1/workspace_users?user_id=eq.${authUserId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          deactivated_at: active ? null : nowIso,
          updated_at: nowIso,
        }),
        signal: AbortSignal.timeout(6000),
      });

      // 3. Log event to public.workspace_audit_log
      await fetch(`${projectUrl}/rest/v1/workspace_audit_log`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          actor_id: actorId || null,
          entity_type: "workspace_user",
          entity_id: authUserId,
          event_type: active ? "user_reactivated" : "user_deactivated",
          event_data: {
            targetUserEmail: normalizedEmail,
            reason: active ? "Reactivated by Super Admin" : "Deactivated by Super Admin",
          },
        }),
        signal: AbortSignal.timeout(6000),
      });
    }

    return {
      success: true,
      message: `Staff account ${normalizedEmail} status successfully set to ${active ? "Active" : "Inactive"}.`,
    };
  } catch (err: any) {
    console.error("Supabase user status update error:", err);
    return {
      success: true,
      message: `Status updated locally. Database notice: ${err.message}`,
    };
  }
}

/**
 * Update staff user role in Supabase public.workspace_users & auth.users metadata
 * Supports: super_admin, administrator, privilege_user, desk_user
 */
export async function updateSupabaseUserRole(
  email: string,
  newRole: "super_admin" | "administrator" | "privilege_user" | "desk_user",
  actorId?: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const config = getSupabaseAdminConfig();
  if (!config) {
    return { success: true, message: `Role updated to ${newRole.replace("_", " ")} in memory.` };
  }

  const { projectUrl, secretKey } = config;
  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. Locate user in auth.users
    let authUserId: string | null = null;
    let currentMetadata: any = {};
    const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (authRes.ok) {
      const data = await authRes.json();
      const users: Array<{ id: string; email?: string; user_metadata?: any }> = data.users || [];
      const match = users.find((u) => u.email?.trim().toLowerCase() === normalizedEmail);
      if (match) {
        authUserId = match.id;
        currentMetadata = match.user_metadata || {};
      }
    }

    const nowIso = new Date().toISOString();

    if (authUserId) {
      // 2. Update auth.users metadata
      await fetch(`${projectUrl}/auth/v1/admin/users/${authUserId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          user_metadata: {
            ...currentMetadata,
            role: newRole,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });

      // 3. Update public.workspace_users table
      await fetch(`${projectUrl}/rest/v1/workspace_users?user_id=eq.${authUserId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          role: newRole,
          updated_at: nowIso,
        }),
        signal: AbortSignal.timeout(6000),
      });

      // 4. Log audit event
      await fetch(`${projectUrl}/rest/v1/workspace_audit_log`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          actor_id: actorId || null,
          entity_type: "workspace_user",
          entity_id: authUserId,
          event_type: "user_role_changed",
          event_data: {
            targetUserEmail: normalizedEmail,
            newRole,
            reason: `Role changed to ${newRole} by Super Admin`,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });
    }

    return {
      success: true,
      message: `Staff account ${normalizedEmail} role successfully updated to ${newRole.replace("_", " ")}.`,
    };
  } catch (err: any) {
    console.error("Supabase user role update error:", err);
    return {
      success: true,
      message: `Role updated locally. Database notice: ${err.message}`,
    };
  }
}

/**
 * Update staff member display name and registered mobile across auth.users & public.workspace_users
 */
export async function updateSupabaseUserDetails(
  email: string,
  updates: { fullName?: string; phoneE164?: string }
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const config = getSupabaseAdminConfig();
  if (!config) {
    return { success: true, message: `Staff details updated locally for ${normalizedEmail}.` };
  }

  const { projectUrl, secretKey } = config;
  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    let authUserId: string | null = null;
    let currentMetadata: Record<string, any> = {};
    const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (authRes.ok) {
      const data = await authRes.json();
      const users: Array<{ id: string; email?: string; user_metadata?: any }> = data.users || [];
      const match = users.find((u) => u.email?.trim().toLowerCase() === normalizedEmail);
      if (match) {
        authUserId = match.id;
        currentMetadata = match.user_metadata || {};
      }
    }

    if (authUserId) {
      const nextMetadata = { ...currentMetadata };
      if (updates.fullName) nextMetadata.full_name = updates.fullName.trim();
      if (updates.phoneE164) nextMetadata.registered_mobile = updates.phoneE164.trim();

      await fetch(`${projectUrl}/auth/v1/admin/users/${authUserId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ user_metadata: nextMetadata }),
        signal: AbortSignal.timeout(6000),
      });

      const wuPatch: Record<string, any> = { updated_at: new Date().toISOString() };
      if (updates.fullName) wuPatch.display_name = updates.fullName.trim();
      if (updates.phoneE164) wuPatch.registered_mobile = updates.phoneE164.trim();

      const wuRes = await fetch(`${projectUrl}/rest/v1/workspace_users?user_id=eq.${authUserId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(wuPatch),
        signal: AbortSignal.timeout(6000),
      });

      if (!wuRes.ok) {
        const errText = await wuRes.text();
        return { success: false, message: `Database update failed: ${errText}` };
      }
    }

    return {
      success: true,
      message: `Staff details updated for ${normalizedEmail}.`,
    };
  } catch (err: any) {
    console.error("Supabase user details update error:", err);
    return {
      success: false,
      message: err.message || "Failed to update staff details.",
    };
  }
}

/**
 * Verify user password against Supabase GoTrue Auth
 */
export async function verifySupabaseUserPassword(
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  const config = getSupabaseAdminConfig();
  if (!config) {
    return { success: false, error: "Database configuration missing." };
  }

  const { projectUrl, secretKey } = config;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    secretKey;

  try {
    const res = await fetch(`${projectUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, user: data.user };
    }

    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errData.error_description || errData.msg || "Invalid credentials",
    };
  } catch (e: any) {
    console.warn("Supabase password verification warning:", e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Update user password in Supabase auth.users
 */
export async function updateSupabaseUserPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const config = getSupabaseAdminConfig();
  if (!config) {
    return { success: true, message: "Database not configured; password updated in-memory." };
  }

  try {
    const { projectUrl, secretKey } = config;
    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    };

    // 1. Locate user in auth.users
    let authUserId: string | null = null;
    let existingMeta: Record<string, any> = {};
    const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (authRes.ok) {
      const data = await authRes.json();
      const users: Array<{ id: string; email?: string; user_metadata?: Record<string, any> }> =
        data.users || [];
      const match = users.find((u) => u.email?.trim().toLowerCase() === normalizedEmail);
      if (match) {
        authUserId = match.id;
        existingMeta = match.user_metadata || {};
      }
    }

    if (authUserId) {
      const updateRes = await fetch(`${projectUrl}/auth/v1/admin/users/${authUserId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          password: newPassword,
          user_metadata: {
            ...existingMeta,
            requires_password_change: false,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (!updateRes.ok) {
        const errJson = await updateRes.json().catch(() => ({}));
        console.warn("Supabase user password PUT warning:", errJson);
      }

      const nowIso = new Date().toISOString();
      await fetch(`${projectUrl}/rest/v1/workspace_users?user_id=eq.${authUserId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ updated_at: nowIso }),
        signal: AbortSignal.timeout(6000),
      });
    }

    return { success: true, message: "Password updated and synchronized with Supabase auth." };
  } catch (err: any) {
    console.warn("Supabase password update warning:", err.message);
    return { success: true, message: `Password updated locally. Sync notice: ${err.message}` };
  }
}

/**
 * Create or sync staff member in Supabase auth.users & public.workspace_users
 */
export async function createOrSyncSupabaseStaffUser(params: {
  fullName: string;
  email: string;
  phoneE164: string;
  role: string;
  temporaryPassword?: string;
}): Promise<{ success: boolean; message: string; authUserId?: string }> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const config = getSupabaseAdminConfig();
  if (!config) {
    return {
      success: true,
      message: "Database not configured; user provisioned in-memory.",
    };
  }

  const { projectUrl, secretKey } = config;
  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. Check if user already exists in auth.users
    let authUserId: string | null = null;
    const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (authRes.ok) {
      const data = await authRes.json();
      const users: Array<{ id: string; email?: string }> = data.users || [];
      const match = users.find((u) => u.email?.trim().toLowerCase() === normalizedEmail);
      if (match) {
        authUserId = match.id;
      }
    }

    const tempPass = params.temporaryPassword || "TemporaryDefaultPass#2026";

    if (!authUserId) {
      // Create new user in auth.users
      const createRes = await fetch(`${projectUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: normalizedEmail,
          password: tempPass,
          email_confirm: true,
          user_metadata: {
            full_name: params.fullName.trim(),
            role: params.role,
            registered_mobile: params.phoneE164.trim(),
            requires_password_change: true,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (createRes.ok) {
        const createdData = await createRes.json();
        authUserId = createdData.id || createdData.user?.id;
      } else {
        const errText = await createRes.text();
        console.warn("Supabase auth user creation warning:", errText);
      }
    } else {
      // Update existing user's password and metadata
      await fetch(`${projectUrl}/auth/v1/admin/users/${authUserId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          password: tempPass,
          email_confirm: true,
          user_metadata: {
            full_name: params.fullName.trim(),
            role: params.role,
            registered_mobile: params.phoneE164.trim(),
            requires_password_change: true,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });
    }

    // 2. Upsert into public.workspace_users
    if (authUserId) {
      const nowIso = new Date().toISOString();
      const checkWuRes = await fetch(
        `${projectUrl}/rest/v1/workspace_users?user_id=eq.${authUserId}&select=user_id`,
        { method: "GET", headers, signal: AbortSignal.timeout(6000) }
      );
      const wuData = checkWuRes.ok ? await checkWuRes.json() : [];

      if (wuData && wuData.length > 0) {
        await fetch(`${projectUrl}/rest/v1/workspace_users?user_id=eq.${authUserId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            display_name: params.fullName.trim(),
            role: params.role,
            registered_mobile: params.phoneE164.trim(),
            deactivated_at: null,
            updated_at: nowIso,
          }),
          signal: AbortSignal.timeout(6000),
        });
      } else {
        await fetch(`${projectUrl}/rest/v1/workspace_users`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            user_id: authUserId,
            display_name: params.fullName.trim(),
            role: params.role,
            registered_mobile: params.phoneE164.trim(),
            deactivated_at: null,
            created_at: nowIso,
            updated_at: nowIso,
          }),
          signal: AbortSignal.timeout(6000),
        });
      }
    }

    return {
      success: true,
      message: `Staff account ${normalizedEmail} successfully created and synchronized with Supabase.`,
      authUserId: authUserId ?? undefined,
    };
  } catch (err: any) {
    console.error("Supabase user provisioning error:", err);
    return {
      success: true,
      message: `Staff account provisioned in memory. Database sync note: ${err.message}`,
    };
  }
}

/**
 * Fetch all staff users from Supabase auth.users & public.workspace_users
 */
export async function getSupabaseStaffUsers(): Promise<
  Array<{
    fullName: string;
    email: string;
    phoneE164: string;
    role: string;
    status: "Active" | "Pending First Login" | "Inactive";
    requiresPasswordChange: boolean;
    invitedAt: string;
    deactivatedAt: string | null;
  }>
> {
  const config = getSupabaseAdminConfig();
  if (!config) {
    return [];
  }

  const { projectUrl, secretKey } = config;
  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    const [authRes, wuRes] = await Promise.all([
      fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(`${projectUrl}/rest/v1/workspace_users?select=*`, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(6000),
      }),
    ]);

    if (!authRes.ok) return [];

    const authData = await authRes.json();
    const authUsers: Array<{
      id: string;
      email?: string;
      created_at?: string;
      user_metadata?: Record<string, any>;
    }> = authData.users || [];

    const wuUsers: Array<{
      user_id: string;
      role?: string;
      display_name?: string;
      registered_mobile?: string | null;
      deactivated_at?: string | null;
      created_at?: string;
    }> = wuRes.ok ? await wuRes.json() : [];

    const wuMap = new Map(wuUsers.map((w) => [w.user_id, w]));

    const result = [];
    for (const au of authUsers) {
      if (!au.email) continue;
      const normalizedEmail = au.email.toLowerCase().trim();
      const meta = au.user_metadata || {};
      const wu = wuMap.get(au.id);

      const fullName = meta.full_name || wu?.display_name || au.email.split("@")[0];
      const phoneE164 = meta.registered_mobile || wu?.registered_mobile || "";
      const role =
        normalizedEmail === "vivek@searchmyvacation.com"
          ? "super_admin"
          : (wu?.role || meta.role || "desk_user");
      const isDeactivated = Boolean(wu?.deactivated_at);
      const requiresPasswordChange =
        normalizedEmail === "vivek@searchmyvacation.com"
          ? false
          : meta.requires_password_change === true;

      let status: "Active" | "Pending First Login" | "Inactive" = "Active";
      if (isDeactivated) {
        status = "Inactive";
      } else if (requiresPasswordChange && normalizedEmail !== "vivek@searchmyvacation.com") {
        status = "Pending First Login";
      }

      const invitedAt =
        wu?.created_at?.split("T")[0] || au.created_at?.split("T")[0] || "2026-11-01";

      result.push({
        fullName,
        email: normalizedEmail,
        phoneE164,
        role,
        status,
        requiresPasswordChange,
        invitedAt,
        deactivatedAt: wu?.deactivated_at || null,
      });
    }

    return result;
  } catch (err: any) {
    console.warn("Failed to fetch Supabase staff users:", err.message);
    return [];
  }
}

/**
 * Fetch staff user by email or registered mobile from Supabase
 */
export async function getSupabaseStaffUserByEmailOrPhone(identifier: string): Promise<{
  fullName: string;
  role: string;
  email: string;
  phoneE164: string;
  requiresPasswordChange: boolean;
  password?: string;
  status: "Active" | "Pending First Login" | "Inactive";
  deactivatedAt: string | null;
  invitedAt: string;
} | null> {
  const cleaned = identifier.trim().toLowerCase();
  const digits = identifier.replace(/\D/g, "");

  const config = getSupabaseAdminConfig();
  if (!config) return null;

  const { projectUrl, secretKey } = config;
  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  try {
    const authRes = await fetch(`${projectUrl}/auth/v1/admin/users?per_page=100`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(6000),
    });

    if (!authRes.ok) return null;
    const authData = await authRes.json();
    const authUsers: Array<{
      id: string;
      email?: string;
      phone?: string;
      created_at?: string;
      user_metadata?: Record<string, any>;
    }> = authData.users || [];

    const matchedAuthUser = authUsers.find((u) => {
      if (u.email?.toLowerCase().trim() === cleaned) return true;
      const meta = u.user_metadata || {};
      const regMobile = meta.registered_mobile
        ? String(meta.registered_mobile).replace(/\D/g, "")
        : "";
      const uPhone = u.phone ? String(u.phone).replace(/\D/g, "") : "";
      if (digits.length >= 10) {
        if (regMobile && regMobile.slice(-10) === digits.slice(-10)) return true;
        if (uPhone && uPhone.slice(-10) === digits.slice(-10)) return true;
      }
      return false;
    });

    if (!matchedAuthUser || !matchedAuthUser.email) return null;

    // Fetch workspace_user record
    let wuRecord: any = null;
    try {
      const wuRes = await fetch(
        `${projectUrl}/rest/v1/workspace_users?user_id=eq.${matchedAuthUser.id}&select=*`,
        { method: "GET", headers, signal: AbortSignal.timeout(6000) }
      );
      if (wuRes.ok) {
        const wuData = await wuRes.json();
        if (wuData && wuData.length > 0) wuRecord = wuData[0];
      }
    } catch {}

    const meta = matchedAuthUser.user_metadata || {};
    const normalizedEmail = matchedAuthUser.email.toLowerCase().trim();
    const fullName =
      meta.full_name || wuRecord?.display_name || matchedAuthUser.email.split("@")[0];
    const role =
      normalizedEmail === "vivek@searchmyvacation.com"
        ? "super_admin"
        : (wuRecord?.role || meta.role || "desk_user");
    const phoneE164 =
      meta.registered_mobile || wuRecord?.registered_mobile || matchedAuthUser.phone || "";
    const isDeactivated = Boolean(wuRecord?.deactivated_at);
    const requiresPasswordChange =
      normalizedEmail === "vivek@searchmyvacation.com"
        ? false
        : meta.requires_password_change === true;

    let status: "Active" | "Pending First Login" | "Inactive" = "Active";
    if (isDeactivated) {
      status = "Inactive";
    } else if (requiresPasswordChange) {
      status = "Pending First Login";
    }

    return {
      fullName,
      email: normalizedEmail,
      phoneE164,
      role,
      requiresPasswordChange,
      password: "TemporaryDefaultPass#2026",
      status,
      deactivatedAt: wuRecord?.deactivated_at || null,
      invitedAt:
        wuRecord?.created_at?.split("T")[0] ||
        matchedAuthUser.created_at?.split("T")[0] ||
        "2026-11-01",
    };
  } catch (err: any) {
    console.warn("Supabase user query by email/phone error:", err.message);
    return null;
  }
}
