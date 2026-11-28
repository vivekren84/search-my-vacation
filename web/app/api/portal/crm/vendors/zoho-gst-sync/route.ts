import { NextResponse } from "next/server";
import { getSupabaseAdminConfig } from "@/lib/supabase/admin";
import { ADMIN_ONLY_ROLES, getAdminHeaders, resolveStaffCaller } from "@/lib/portal/trip-helpers";

export const runtime = "nodejs";

/**
 * RFC-4180 CSV parser supporting quoted multi-line fields and escaped quotes.
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cell);
        cell = "";
      } else if (ch === "\r" && next === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
        i++;
      } else if (ch === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += ch;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function cleanZohoPhone(raw: string): string {
  return raw.replace(/^'+/, "").trim();
}

function last10Digits(raw: string): string {
  const digits = cleanZohoPhone(raw).replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : "";
}

function normalizeNameKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\b(pvt|private|ltd|limited|llp|inc|co|india|hotels|resorts|hotel|resort|tours|travels)\b/g, " ")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function extractVendorEmails(v: any): string[] {
  const out: string[] = [];
  if (v.email) out.push(String(v.email).toLowerCase().trim());
  if (Array.isArray(v.contacts)) {
    for (const c of v.contacts) {
      for (const e of c?.emails || []) {
        const clean = String(e).toLowerCase().trim();
        if (clean && !out.includes(clean)) out.push(clean);
      }
    }
  }
  return out;
}

function extractVendorPhonesLast10(v: any): string[] {
  const out: string[] = [];
  for (const raw of [v.poc_mobile, v.office_phone]) {
    const l10 = last10Digits(String(raw || ""));
    if (l10 && !out.includes(l10)) out.push(l10);
  }
  if (Array.isArray(v.contacts)) {
    for (const c of v.contacts) {
      for (const p of c?.phones || []) {
        const l10 = last10Digits(String(p || ""));
        if (l10 && !out.includes(l10)) out.push(l10);
      }
    }
  }
  return out;
}

/**
 * POST /api/portal/crm/vendors/zoho-gst-sync
 * Dry-run or commit Zoho Books CSV GST & phone sync.
 * RBAC: Strictly super_admin and administrator.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const caller = await resolveStaffCaller(request, body.callerEmail, body.callerName, body.callerRole);

    if (!ADMIN_ONLY_ROLES.has(caller.role)) {
      return NextResponse.json(
        { ok: false, message: "Permission Denied: Only Super Admin and Administrators can import Zoho GST data." },
        { status: 403 }
      );
    }

    const { csvText, mode = "preview", overwriteExisting = false } = body;
    if (!csvText || typeof csvText !== "string") {
      return NextResponse.json({ ok: false, message: "CSV content is required." }, { status: 400 });
    }

    const rows = parseCsvRows(csvText);
    if (rows.length < 2) {
      return NextResponse.json({ ok: false, message: "CSV has no data rows." }, { status: 400 });
    }

    const header = rows[0].map((h) => h.trim());
    const idx = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());

    const iContactId = idx("Contact ID");
    const iContactName = idx("Contact Name");
    const iCompanyName = idx("Company Name");
    const iDisplayName = idx("Display Name");
    const iEmail = idx("EmailID");
    const iPhone = idx("Phone");
    const iMobile = idx("MobilePhone");
    const iGstTreatment = idx("GST Treatment");
    const iGstin = idx("GST Identification Number (GSTIN)");

    if (iGstin === -1) {
      return NextResponse.json(
        { ok: false, message: 'Missing required column "GST Identification Number (GSTIN)" in CSV.' },
        { status: 400 }
      );
    }

    const config = getSupabaseAdminConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: "Database configuration missing." }, { status: 500 });
    }

    const headers = getAdminHeaders(config.secretKey);
    const vendorsRes = await fetch(`${config.projectUrl}/rest/v1/workspace_vendors?select=*`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!vendorsRes.ok) {
      return NextResponse.json({ ok: false, message: "Failed to fetch workspace_vendors." }, { status: 502 });
    }
    const vendors: any[] = await vendorsRes.json();

    const matchedReady: any[] = [];
    const conflicts: any[] = [];
    const unmatched: any[] = [];
    let ignoredBusinessNone = 0;

    for (let r = 1; r < rows.length; r++) {
      const cols = rows[r];
      const gstTreatment = (iGstTreatment >= 0 ? cols[iGstTreatment] : "").trim();
      const gstin = (cols[iGstin] || "").trim().toUpperCase();

      // Rule: Ignore business_none or empty GSTIN rows
      if (gstTreatment.toLowerCase() === "business_none" || !gstin) {
        ignoredBusinessNone++;
        continue;
      }

      const zohoContactId = (iContactId >= 0 ? cols[iContactId] : "").trim();
      const contactName = (iContactName >= 0 ? cols[iContactName] : "").trim();
      const companyName = (iCompanyName >= 0 ? cols[iCompanyName] : "").trim();
      const displayName = (iDisplayName >= 0 ? cols[iDisplayName] : "").trim();
      const email = (iEmail >= 0 ? cols[iEmail] : "").trim().toLowerCase();
      const rawPhone = cleanZohoPhone(iPhone >= 0 ? cols[iPhone] || "" : "");
      const rawMobile = cleanZohoPhone(iMobile >= 0 ? cols[iMobile] || "" : "");

      const zohoPhones = [rawMobile, rawPhone].filter(Boolean);
      const zohoPhoneLast10s = zohoPhones.map(last10Digits).filter(Boolean);

      // 3-Tier Matching: 1) Email -> 2) Last-10-Digits Phone -> 3) Normalized Name
      let match: any = null;
      let matchTier = "";

      if (email) {
        match = vendors.find((v) => extractVendorEmails(v).includes(email));
        if (match) matchTier = "Tier 1: Email";
      }
      if (!match && zohoPhoneLast10s.length > 0) {
        match = vendors.find((v) => {
          const vp = extractVendorPhonesLast10(v);
          return zohoPhoneLast10s.some((zl) => vp.includes(zl));
        });
        if (match) matchTier = "Tier 2: Phone";
      }
      if (!match) {
        const candidates = [companyName, contactName, displayName].filter(Boolean);
        match = vendors.find((v) => {
          const vNorm = normalizeNameKey(v.name || "");
          const vExact = (v.name || "").trim().toLowerCase();
          return candidates.some(
            (c) =>
              c.toLowerCase() === vExact ||
              (vNorm.length >= 4 && normalizeNameKey(c) === vNorm)
          );
        });
        if (match) matchTier = "Tier 3: Name";
      }

      if (!match) {
        unmatched.push({
          zohoContactId,
          vendorName: companyName || contactName || displayName,
          email,
          phone: zohoPhones[0] || "",
          gstTreatment,
          gstin,
        });
        continue;
      }

      // Check phone update rule: only add if DB phone is empty OR Zoho phone is different
      const existingLast10s = extractVendorPhonesLast10(match);
      const newPhonesToAdd = zohoPhones.filter((zp) => {
        const l10 = last10Digits(zp);
        return l10 && !existingLast10s.includes(l10);
      });

      const entry = {
        vendorId: match.id,
        vendorCode: match.vendor_code,
        vendorName: match.name,
        zohoName: companyName || contactName || displayName,
        zohoContactId,
        gstTreatment,
        gstin,
        existingGst: match.gst_number || null,
        matchTier,
        newPhonesToAdd,
      };

      if (match.gst_number && match.gst_number.trim().toUpperCase() !== gstin) {
        conflicts.push(entry);
      } else {
        matchedReady.push(entry);
      }
    }

    if (mode === "preview") {
      return NextResponse.json({
        ok: true,
        ignoredBusinessNone,
        matchedReady,
        conflicts,
        unmatched,
      });
    }

    // Commit batch updates
    const toApply = overwriteExisting ? [...matchedReady, ...conflicts] : matchedReady;
    let updatedCount = 0;

    for (const item of toApply) {
      const targetVendor = vendors.find((v) => v.id === item.vendorId);
      if (!targetVendor) continue;

      const patch: Record<string, any> = {
        gst_number: item.gstin,
        gst_treatment: item.gstTreatment || "business_gst",
        zoho_contact_id: item.zohoContactId || targetVendor.zoho_contact_id || null,
        updated_at: new Date().toISOString(),
      };

      if (item.newPhonesToAdd.length > 0) {
        const contacts = Array.isArray(targetVendor.contacts) ? [...targetVendor.contacts] : [];
        if (contacts.length === 0) {
          contacts.push({
            id: crypto.randomUUID(),
            name: targetVendor.poc_name || "Primary Contact",
            designation: "Reservations / Sales",
            emails: targetVendor.email ? [targetVendor.email] : [],
            phones: item.newPhonesToAdd,
            is_primary: true,
          });
        } else {
          const primaryPhones = Array.isArray(contacts[0].phones) ? [...contacts[0].phones] : [];
          for (const np of item.newPhonesToAdd) {
            if (!primaryPhones.includes(np)) primaryPhones.push(np);
          }
          contacts[0] = { ...contacts[0], phones: primaryPhones };
        }
        patch.contacts = contacts;
      }

      const patchRes = await fetch(
        `${config.projectUrl}/rest/v1/workspace_vendors?id=eq.${encodeURIComponent(item.vendorId)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(patch),
          signal: AbortSignal.timeout(5000),
        }
      );
      if (patchRes.ok) updatedCount++;
    }

    return NextResponse.json({
      ok: true,
      updatedCount,
      skippedConflicts: overwriteExisting ? 0 : conflicts.length,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || "Zoho GST sync failed." }, { status: 500 });
  }
}
