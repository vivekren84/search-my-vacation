/**
 * ingest-production-vendors.mjs
 * Ingestion script for SMV Vetted Vendor Directory (Release 1.5.2)
 *
 * Imports 456 clean vendors from SMV - One Tracker.xlsx:
 * 1. Domestic -Property DB (~371 properties)
 * 2. Domestic - Cab DB (19 cab operators)
 * 3. International Property & Cab (34 international stays & cabs)
 * 4. DMCs (21 Destination Management Companies)
 * 5. Agency DB (11 Partner Agencies)
 *
 * Guardrails:
 * - Brand Tone: ZERO occurrences of prohibited term (auto-sanitizes to premier/boutique)
 * - Safe Deduplication by Name + Category
 * - Dry-run mode by default, requires --live to commit to database
 */

import ExcelJS from "exceljs";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read arguments
const isLive = process.argv.includes("--live");
const isDryRun = !isLive || process.argv.includes("--dry-run");

// Load .env.local if present
function loadEnv() {
  const envPath = resolve(__dirname, "../.env.local");
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const k = trimmed.substring(0, eqIdx).trim();
        const v = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.PROD_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PROD_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (isLive && (!supabaseUrl || !supabaseKey)) {
  console.error("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required for --live mode.");
  process.exit(1);
}

function extractCellValue(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") {
    if (val.text) return String(val.text).trim();
    if (val.result !== undefined && val.result !== null) return String(val.result).trim();
    if (val.hyperlink) return String(val.hyperlink).trim();
    return String(JSON.stringify(val)).trim();
  }
  const s = String(val).trim();
  return s || null;
}

function cleanString(val) {
  const s = extractCellValue(val);
  if (!s || s === "—" || s === "-" || s === "NA" || s === "N/A" || s === "TBD" || s === "TBU") return null;
  return s;
}

function sanitizeBrandTone(str) {
  if (!str) return str;
  // Replace prohibited term with permitted slow-travel tone words
  return str
    .replace(/\bluxury\b/gi, "premier")
    .replace(/\bluxurious\b/gi, "high-touch")
    .replace(/\blux\b/gi, "boutique");
}

function normalizePhone(val) {
  let s = cleanString(val);
  if (!s) return null;
  // Strip control chars & invisible spaces
  s = s.replace(/[\u202a\u202c\u200e\u200f]/g, "").trim();
  // Split on newlines if multiple numbers
  if (s.includes("\n")) {
    s = s.split("\n")[0].trim();
  }
  return s || null;
}

async function main() {
  console.log("==================================================================");
  console.log("  Search My Vacation — Vetted Vendor Directory Ingestion (R1.5.2)  ");
  console.log(`  Mode: ${isLive ? "LIVE EXECUTION (Database commits ENABLED)" : "DRY-RUN PREVIEW (No DB changes)"}`);
  if (isLive) {
    console.log(`  Target Supabase: ${supabaseUrl}`);
  }
  console.log("==================================================================\n");

  const trackerPath = resolve(
    "/Users/viveksophu/.gemini/antigravity/brain/50cb3ba2-4be6-48af-9a59-14d7d259b507/.user_uploaded/media_1795441633973_0dd0455a.xlsx"
  );

  if (!existsSync(trackerPath)) {
    console.error(`Tracker file not found at: ${trackerPath}`);
    process.exit(1);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(trackerPath);

  const vendors = [];
  const seenNames = new Set();

  // -------------------------------------------------------------
  // Sheet 1: Domestic -Property DB
  // -------------------------------------------------------------
  const wsProp = wb.getWorksheet("Domestic -Property DB");
  if (wsProp) {
    let propCount = 0;
    wsProp.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return;
      const rawName = cleanString(row.getCell(4).value);
      if (!rawName || rawName === "Property Name") return;

      const category = "property";
      const starRating = sanitizeBrandTone(cleanString(row.getCell(1).value));
      const region = cleanString(row.getCell(2).value);
      const destination = cleanString(row.getCell(3).value);
      const rateCardLink = cleanString(row.getCell(10).value);
      const website = cleanString(row.getCell(11).value);
      const address = cleanString(row.getCell(12).value);
      const pocMobile = normalizePhone(row.getCell(13).value);
      const pocName = cleanString(row.getCell(14).value);
      const officePhone = normalizePhone(row.getCell(15).value);
      const email = cleanString(row.getCell(16).value);
      const b2bPeak = cleanString(row.getCell(17).value);
      const b2bNonPeak = cleanString(row.getCell(18).value);
      const comments = sanitizeBrandTone(cleanString(row.getCell(20).value));

      let b2bRates = null;
      if (b2bPeak || b2bNonPeak) {
        b2bRates = [b2bPeak ? `Peak: ${b2bPeak}` : null, b2bNonPeak ? `Non-Peak: ${b2bNonPeak}` : null]
          .filter(Boolean)
          .join(" | ");
      }

      const key = `${category}::${rawName.toLowerCase()}`;
      if (!seenNames.has(key)) {
        seenNames.add(key);
        vendors.push({
          name: sanitizeBrandTone(rawName),
          category,
          destination,
          region,
          star_rating: starRating,
          poc_name: pocName,
          poc_mobile: pocMobile,
          office_phone: officePhone,
          email,
          website,
          address,
          rate_card_link: rateCardLink,
          b2b_rates: b2bRates,
          comments,
          is_active: true,
          created_by_user_id: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
          metadata: {
            source_sheet: "Domestic -Property DB",
            source_row: rowNumber,
            chain: cleanString(row.getCell(6).value),
            meal_plan: cleanString(row.getCell(9).value),
          },
        });
        propCount++;
      }
    });
    console.log(`✓ Domestic Properties: parsed ${propCount} valid hotels/resorts`);
  }

  // -------------------------------------------------------------
  // Sheet 2: Domestic - Cab DB
  // -------------------------------------------------------------
  const wsCab = wb.getWorksheet("Domestic - Cab DB");
  if (wsCab) {
    let cabCount = 0;
    wsCab.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return;
      const rawName = cleanString(row.getCell(3).value);
      if (!rawName || rawName === "Cab Name") return;

      const category = "cab";
      const region = cleanString(row.getCell(1).value);
      const destination = cleanString(row.getCell(2).value);
      const comments1 = cleanString(row.getCell(4).value);
      const rateCardLink = cleanString(row.getCell(5).value);
      const website = cleanString(row.getCell(6).value);
      const address = cleanString(row.getCell(7).value);
      const pocMobile = normalizePhone(row.getCell(8).value);
      const pocName = cleanString(row.getCell(9).value);
      const email = cleanString(row.getCell(10).value);
      const b2bRates = cleanString(row.getCell(11).value);
      const comments2 = cleanString(row.getCell(12).value);

      const commentsCombined = [comments1, comments2].filter(Boolean).join(" • ");

      const key = `${category}::${rawName.toLowerCase()}`;
      if (!seenNames.has(key)) {
        seenNames.add(key);
        vendors.push({
          name: sanitizeBrandTone(rawName),
          category,
          destination,
          region,
          star_rating: "Fleet Operator",
          poc_name: pocName,
          poc_mobile: pocMobile,
          office_phone: null,
          email,
          website,
          address,
          rate_card_link: rateCardLink,
          b2b_rates: b2bRates,
          comments: sanitizeBrandTone(commentsCombined) || null,
          is_active: true,
          created_by_user_id: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
          metadata: {
            source_sheet: "Domestic - Cab DB",
            source_row: rowNumber,
          },
        });
        cabCount++;
      }
    });
    console.log(`✓ Domestic Cab Fleet: parsed ${cabCount} operators`);
  }

  // -------------------------------------------------------------
  // Sheet 3: International Property & Cab
  // -------------------------------------------------------------
  const wsIntl = wb.getWorksheet("International Property & Cab");
  if (wsIntl) {
    let intlCount = 0;
    wsIntl.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return;
      const rawName = cleanString(row.getCell(5).value);
      if (!rawName || rawName === "Name") return;

      const typeRaw = (cleanString(row.getCell(4).value) || "").toLowerCase();
      const category = typeRaw.includes("cab") ? "cab" : "property";
      const destination = cleanString(row.getCell(2).value);
      const city = cleanString(row.getCell(3).value);
      const email = cleanString(row.getCell(6).value);
      const starRating = sanitizeBrandTone(cleanString(row.getCell(7).value));
      const mobile = normalizePhone(row.getCell(8).value);
      const website = cleanString(row.getCell(9).value);
      const poc = cleanString(row.getCell(10).value);
      const comments = sanitizeBrandTone(cleanString(row.getCell(13).value));

      const key = `${category}::${rawName.toLowerCase()}`;
      if (!seenNames.has(key)) {
        seenNames.add(key);
        vendors.push({
          name: sanitizeBrandTone(rawName),
          category,
          destination: city ? `${city}, ${destination}` : destination,
          region: "International",
          star_rating: starRating,
          poc_name: poc,
          poc_mobile: mobile,
          office_phone: null,
          email,
          website,
          address: null,
          rate_card_link: null,
          b2b_rates: null,
          comments,
          is_active: true,
          created_by_user_id: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
          metadata: {
            source_sheet: "International Property & Cab",
            source_row: rowNumber,
          },
        });
        intlCount++;
      }
    });
    console.log(`✓ International Stays & Cabs: parsed ${intlCount} partners`);
  }

  // -------------------------------------------------------------
  // Sheet 4: DMCs (Destination Management Companies)
  // -------------------------------------------------------------
  const wsDmc = wb.getWorksheet("DMCs");
  if (wsDmc) {
    let dmcCount = 0;
    wsDmc.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return;
      const rawName = cleanString(row.getCell(1).value);
      if (!rawName || rawName === "Name") return;

      const category = "dmc";
      const destination = cleanString(row.getCell(2).value);
      const email1 = cleanString(row.getCell(3).value);
      const email2 = cleanString(row.getCell(4).value);
      const poc1 = cleanString(row.getCell(5).value);
      const phone1 = normalizePhone(row.getCell(6).value);
      const poc2 = cleanString(row.getCell(7).value);
      const phone2 = normalizePhone(row.getCell(8).value);

      const emailCombined = [email1, email2].filter(Boolean).join(" / ");
      const pocCombined = [
        poc1 ? `${poc1} (${phone1 || "No Phone"})` : null,
        poc2 ? `${poc2} (${phone2 || "No Phone"})` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const key = `${category}::${rawName.toLowerCase()}`;
      if (!seenNames.has(key)) {
        seenNames.add(key);
        vendors.push({
          name: sanitizeBrandTone(rawName),
          category,
          destination,
          region: "DMC Partner Network",
          star_rating: "Contracted DMC",
          poc_name: poc1 || poc2 || null,
          poc_mobile: phone1 || phone2 || null,
          office_phone: null,
          email: emailCombined || null,
          website: null,
          address: null,
          rate_card_link: null,
          b2b_rates: "Contracted Net Rates",
          comments: pocCombined ? `POC Contacts: ${pocCombined}` : null,
          is_active: true,
          created_by_user_id: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
          metadata: {
            source_sheet: "DMCs",
            source_row: rowNumber,
          },
        });
        dmcCount++;
      }
    });
    console.log(`✓ Destination Management Companies: parsed ${dmcCount} DMCs`);
  }

  // -------------------------------------------------------------
  // Sheet 5: Agency DB
  // -------------------------------------------------------------
  const wsAgency = wb.getWorksheet("Agency DB");
  if (wsAgency) {
    let agencyCount = 0;
    wsAgency.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) return;
      const rawName = cleanString(row.getCell(2).value);
      if (!rawName || rawName === "Property Name" || rawName === "Name") return;

      const category = "agency";
      const destination = cleanString(row.getCell(1).value);
      const website = cleanString(row.getCell(3).value);
      const address = cleanString(row.getCell(4).value);
      const pocMobile = normalizePhone(row.getCell(5).value);
      const pocName = cleanString(row.getCell(6).value);
      const altPhone = normalizePhone(row.getCell(7).value);
      const email = cleanString(row.getCell(8).value);

      const key = `${category}::${rawName.toLowerCase()}`;
      if (!seenNames.has(key)) {
        seenNames.add(key);
        vendors.push({
          name: sanitizeBrandTone(rawName),
          category,
          destination,
          region: "Agency Network",
          star_rating: "Partner Agency",
          poc_name: pocName,
          poc_mobile: pocMobile,
          office_phone: altPhone,
          email,
          website,
          address,
          rate_card_link: null,
          b2b_rates: "B2B Commission / Net Rates",
          comments: null,
          is_active: true,
          created_by_user_id: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
          metadata: {
            source_sheet: "Agency DB",
            source_row: rowNumber,
          },
        });
        agencyCount++;
      }
    });
    console.log(`✓ Partner Agencies: parsed ${agencyCount} agencies`);
  }

  console.log(`\nTOTAL UNIQUE CLEAN VENDORS COMPILED: ${vendors.length}`);

  // Brand Tone Mandate Verification
  let brandViolations = 0;
  for (const v of vendors) {
    const jsonStr = JSON.stringify(v).toLowerCase();
    if (/\bluxury\b/.test(jsonStr)) {
      console.error(`BRAND VIOLATION in vendor: ${v.name}`);
      brandViolations++;
    }
  }

  if (brandViolations > 0) {
    console.error(`FATAL: Found ${brandViolations} brand tone violations. Aborting.`);
    process.exit(1);
  } else {
    console.log("✓ Brand Tone Verification Passed: Strictly 0 occurrences of prohibited terms.");
  }

  // Breakdown by Category
  const byCategory = vendors.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});
  console.log("\nBreakdown by Category:", byCategory);

  // If Dry Run, print samples and exit
  if (isDryRun) {
    console.log("\n--- Sample Vendor Records (Dry-Run Preview) ---");
    console.log("1. Property:", JSON.stringify(vendors.find((v) => v.category === "property"), null, 2));
    console.log("2. Cab:", JSON.stringify(vendors.find((v) => v.category === "cab"), null, 2));
    console.log("3. DMC:", JSON.stringify(vendors.find((v) => v.category === "dmc"), null, 2));
    console.log("4. Agency:", JSON.stringify(vendors.find((v) => v.category === "agency"), null, 2));
    console.log("\n[DRY RUN COMPLETE] To insert into database, execute with --live.");
    return;
  }

  // -------------------------------------------------------------
  // Live Ingestion via Supabase REST API
  // -------------------------------------------------------------
  console.log("\n[LIVE INGESTION] Committing vendors to public.workspace_vendors...");
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  const BATCH_SIZE = 50;
  let insertedCount = 0;

  for (let i = 0; i < vendors.length; i += BATCH_SIZE) {
    const batch = vendors.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${supabaseUrl}/rest/v1/workspace_vendors`, {
      method: "POST",
      headers,
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Batch ${i / BATCH_SIZE + 1} failed: ${errText}`);
      process.exit(1);
    }

    const inserted = await res.json();
    insertedCount += inserted.length;
    console.log(`  Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${insertedCount}/${vendors.length} vendors)`);
  }

  console.log(`\n🎉 SUCCESS: Successfully ingested ${insertedCount} vendors into public.workspace_vendors!`);
}

main().catch((err) => {
  console.error("Fatal error during vendor ingestion:", err);
  process.exit(1);
});
