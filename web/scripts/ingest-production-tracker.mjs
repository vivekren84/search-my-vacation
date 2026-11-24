import ExcelJS from "exceljs";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Production Supabase Configuration
const prodUrl = process.env.PROD_URL || "https://jbsefolhlfkplawiuvlu.supabase.co";
const prodKey = process.env.PROD_KEY;

if (!prodKey) {
  console.error("ERROR: PROD_KEY environment variable is required.");
  process.exit(1);
}

const headers = {
  apikey: prodKey,
  Authorization: `Bearer ${prodKey}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// Production Staff UUID mapping
const STAFF_PROD = {
  vivek: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
  dinesh: "720346ac-aab7-496f-b6e8-ecbb38316a94",
  anand: "1d5ba68d-23c6-43a3-81a6-2fbc67fa0ee7",
  keerthi: "2010d027-8ea5-4390-9cd5-3c8d8b69f9cf",
};

function resolveStaffId(rawOwner) {
  if (!rawOwner) return STAFF_PROD.vivek;
  const lower = String(rawOwner).toLowerCase();
  if (lower.includes("anand")) return STAFF_PROD.anand;
  if (lower.includes("keerthi")) return STAFF_PROD.keerthi;
  if (lower.includes("dinesh")) return STAFF_PROD.dinesh;
  return STAFF_PROD.vivek;
}

function cleanString(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (!s || s === "—" || s === "-" || s === "NA" || s === "TBD" || s === "TBU") return null;
  return s;
}

function cleanNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function normalizeTripStatus(val) {
  const s = cleanString(val);
  if (!s) return "To Start";
  const lower = s.toLowerCase();
  if (lower.includes("complete")) return "Complete";
  if (lower.includes("lost")) return "Lost";
  if (lower.includes("hold")) return "On Hold";
  if (lower.includes("progress")) return "In Progress";
  return "To Start";
}

function normalizePaymentStatus(val) {
  const s = cleanString(val);
  if (!s) return "To Start";
  const lower = s.toLowerCase();
  if (lower.includes("won")) return "Won";
  if (lower.includes("lost")) return "Lost";
  if (lower.includes("hold")) return "On Hold";
  if (lower.includes("progress")) return "In Progress";
  return "To Start";
}

function normalizeDealStage(val) {
  const s = cleanString(val);
  if (!s) return "Enquiry";
  const lower = s.toLowerCase();
  if (lower.includes("booked") || lower.includes("won")) return "Booked/Won";
  if (lower.includes("lost")) return "Lost";
  if (lower.includes("hold")) return "On Hold";
  if (lower.includes("progress")) return "In Progress";
  return "Enquiry";
}

function normalizePartyType(val) {
  const s = cleanString(val);
  if (!s) return "Family";
  const lower = s.toLowerCase();
  if (lower.includes("solo")) return "Solo";
  if (lower.includes("group")) return "Group";
  if (lower.includes("corp")) return "Corporate";
  if (lower.includes("family")) return "Family";
  return "Other";
}

async function runIngestion() {
  console.log("================================================================================");
  console.log("=== SMV PRODUCTION TRACKER INGESTION (jbsefolhlfkplawiuvlu) ===");
  console.log("================================================================================\n");

  const workbookPath = resolve(__dirname, "../../SMV_Release_Charter_Approved/SMV_One_Tracker_Reconciliation_Master.xlsx");
  if (!existsSync(workbookPath)) {
    throw new Error(`Workbook not found at ${workbookPath}`);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(workbookPath);

  // 0. Clean slate on Production workspace tables
  console.log("--> [Step 0] Ensuring clean slate on Production workspace_trips and workspace_customers...");
  await fetch(`${prodUrl}/rest/v1/workspace_trips?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: "DELETE",
    headers,
  });
  await fetch(`${prodUrl}/rest/v1/workspace_customers?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: "DELETE",
    headers,
  });

  // 1. Read and filter Customers
  console.log("--> [Step 1] Loading and sanitizing Customers...");
  const custSheet = wb.getWorksheet("Reconciled Master (Customers)");
  const customersToInsert = [];

  // Excluded placeholder codes from OQ-04 and OQ-05
  const droppedCustCodes = new Set(["CUST-00222", "CUST-00223", "CUST-00224", "CUST-00225", "CUST-00234"]);

  custSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const v = row.values;
    const code = cleanString(v[1]);
    let name = cleanString(v[2]);
    const mobile = cleanString(v[3]);
    const secondaryMobile = cleanString(v[4]);
    const email = cleanString(v[5]);
    let needsEnrichment = String(v[8]).toUpperCase() === "YES";
    const leadOwner = cleanString(v[10]);

    if (!code) return;
    if (droppedCustCodes.has(code)) {
      console.log(`    Dropping placeholder customer ${code} per PO directive (OQ-04/05).`);
      return;
    }

    if (!name) {
      name = mobile ? `Lead (${mobile})` : `Customer ${code}`;
      needsEnrichment = true;
      console.log(`    Enriching missing name for ${code} -> "${name}"`);
    }

    customersToInsert.push({
      customer_code: code,
      primary_name: name,
      primary_mobile: mobile || null,
      secondary_mobile: secondaryMobile || null,
      primary_email: email || null,
      zoho_synced: false,
      needs_contact_enrichment: needsEnrichment,
      created_by_user_id: resolveStaffId(leadOwner),
    });
  });

  console.log(`    Found ${customersToInsert.length} valid customers to insert.`);

  // 2. Read and filter Trips
  console.log("\n--> [Step 2] Loading and sanitizing Trips & Deals...");
  const tripSheet = wb.getWorksheet("Reconciled Master (Trips)");
  const tripsToInsert = [];

  tripSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const v = row.values;

    let dealRef = cleanString(v[1]);
    const origSmv = cleanString(v[2]);
    let custCode = cleanString(v[3]);
    const custName = cleanString(v[4]);
    const mobile = cleanString(v[5]);
    const channel = cleanString(v[6]) === "VENDOR" ? "VENDOR" : "DIRECT";
    const leadOwner = cleanString(v[7]);
    const partyType = normalizePartyType(v[8]);
    const adults = Math.max(1, parseInt(v[9], 10) || 1);
    const children = Math.max(0, parseInt(v[10], 10) || 0);
    const destination = cleanString(v[11]) || "Bespoke Journey";
    const year = parseInt(v[12], 10) || 2026;
    const month = cleanString(v[13]);
    const duration = cleanString(v[14]);
    const nights = Math.max(0, parseInt(v[15], 10) || 0);
    const dealStage = normalizeDealStage(v[16]);
    const paymentStatus = normalizePaymentStatus(v[17]);
    const tripStatus = normalizeTripStatus(v[18]);
    const travelDates = cleanString(v[19]);
    const bookedPlaces = cleanString(v[21]);
    const bookedTransport = cleanString(v[22]);
    const actualCost = cleanNumber(v[23]);
    const quotePrice = cleanNumber(v[24]);
    const preTax = cleanNumber(v[25]);
    const gst = cleanNumber(v[26]);
    const profit = cleanNumber(v[27]);
    const notes = cleanString(v[28]);
    const sourceProv = cleanString(v[29]);

    if (!dealRef || !custCode) return;

    // Drop trips associated with dropped placeholder customers (OQ-04/05)
    if (droppedCustCodes.has(custCode)) {
      console.log(`    Dropping trip ${dealRef} (${custName}) per PO directive.`);
      return;
    }

    // OQ-01: Renumber Deepak Jain from DDSMV-25-041B to DDSMV-25-091
    if (dealRef === "DDSMV-25-041B" || (dealRef.includes("041") && custName?.toLowerCase().includes("deepak"))) {
      dealRef = "DDSMV-25-091";
      console.log(`    Applied OQ-01: Renumbered Deepak Jain to DDSMV-25-091.`);
    }

    // OQ-02: Merge Priya Andaman Makruzz sub-record
    if (dealRef === "DDSMV-25-008-MAK") {
      console.log(`    Applied OQ-02: Combined Priya Makruzz sub-record into DDSMV-25-008.`);
      return;
    }

    tripsToInsert.push({
      deal_reference_id: dealRef,
      customer_code: custCode,
      deal_channel: channel,
      lead_owner_id: resolveStaffId(leadOwner),
      destination,
      travel_year: year,
      travel_month: month,
      duration_label: duration,
      nights,
      travel_party_type: partyType,
      pax_adults: adults,
      pax_children: children,
      deal_stage: dealStage,
      payment_status: paymentStatus,
      trip_status: tripStatus,
      booked_properties: bookedPlaces,
      booked_transport: bookedTransport,
      actual_cost: actualCost,
      quote_price: quotePrice,
      pre_tax_amount: preTax,
      gst_amount: gst,
      profit: profit,
      notes: notes,
      metadata: {
        original_smv_number: origSmv,
        travel_dates_raw: travelDates,
        source_provenance: sourceProv,
        lead_source_detail: leadOwner,
      },
    });
  });

  console.log(`    Found ${tripsToInsert.length} valid trips to insert.`);

  // 3. Insert Customers into Production Supabase
  console.log("\n--> [Step 3] Ingesting Customers into Production public.workspace_customers...");
  const customerIdMap = new Map(); // customer_code -> UUID

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  for (let i = 0; i < customersToInsert.length; i += BATCH_SIZE) {
    const batch = customersToInsert.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${prodUrl}/rest/v1/workspace_customers`, {
      method: "POST",
      headers,
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Customer batch ${i / BATCH_SIZE + 1} insertion failed: ${err}`);
    }

    const inserted = await res.json();
    for (const c of inserted) {
      customerIdMap.set(c.customer_code, c.id);
    }
    console.log(`    Ingested customers ${i + 1} to ${Math.min(i + BATCH_SIZE, customersToInsert.length)} (${inserted.length} created)`);
  }

  console.log(`  ✓ Successfully created ${customerIdMap.size} Customer Master profiles.`);

  // 4. Insert Trips into Production Supabase
  console.log("\n--> [Step 4] Ingesting Trips & Deals into Production public.workspace_trips...");
  const tripsPayload = tripsToInsert.map((t) => {
    const custId = customerIdMap.get(t.customer_code);
    if (!custId) {
      throw new Error(`Missing customer UUID for code ${t.customer_code} (Trip ${t.deal_reference_id})`);
    }
    const { customer_code, ...rest } = t;
    return {
      ...rest,
      customer_id: custId,
    };
  });

  let totalTripsInserted = 0;
  for (let i = 0; i < tripsPayload.length; i += BATCH_SIZE) {
    const batch = tripsPayload.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${prodUrl}/rest/v1/workspace_trips`, {
      method: "POST",
      headers,
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Trip batch ${i / BATCH_SIZE + 1} insertion failed: ${err}`);
    }

    const inserted = await res.json();
    totalTripsInserted += inserted.length;
    console.log(`    Ingested trips ${i + 1} to ${Math.min(i + BATCH_SIZE, tripsPayload.length)} (${inserted.length} created)`);
  }

  console.log(`  ✓ Successfully created ${totalTripsInserted} Trip / Deal records.`);

  // 5. Sequence Synchronization
  console.log("\n--> [Step 5] Synchronizing deal_id_sequences counters in Production...");
  const maxSequences = new Map(); // key: "CHANNEL-YEAR" -> max sequence number

  for (const t of tripsToInsert) {
    // Example format: DDSMV-26-136 or VDSMV-26-015
    const parts = t.deal_reference_id.split("-");
    if (parts.length >= 3) {
      const prefix = parts[0]; // DDSMV or VDSMV
      const channel = prefix.startsWith("V") ? "VENDOR" : "DIRECT";
      const year = 2000 + (parseInt(parts[1], 10) || 26);
      const seqStr = parts[2].replace(/\D/g, "");
      const seqNum = parseInt(seqStr, 10);
      if (!isNaN(seqNum)) {
        const key = `${channel}-${year}`;
        const currMax = maxSequences.get(key) || 0;
        if (seqNum > currMax) maxSequences.set(key, seqNum);
      }
    }
  }

  const seqRecords = [];
  for (const [key, maxVal] of maxSequences.entries()) {
    const [channel, yearStr] = key.split("-");
    seqRecords.push({
      deal_channel: channel,
      year: parseInt(yearStr, 10),
      last_val: maxVal,
    });
  }

  const seqRes = await fetch(`${prodUrl}/rest/v1/deal_id_sequences`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(seqRecords),
  });

  if (!seqRes.ok) {
    const err = await seqRes.text();
    console.warn("Sequence upsert warning:", err);
  } else {
    console.log("  ✓ Sequence counters synchronized in deal_id_sequences:");
    for (const s of seqRecords) {
      console.log(`    - ${s.deal_channel} (${s.year}): current counter = ${s.last_val}`);
    }
  }

  // 6. Advance customer_code_seq past max ingested customer code via RPC
  let maxCustNum = 100;
  for (const c of customersToInsert) {
    const num = parseInt(c.customer_code.replace("CUST-", ""), 10);
    if (!isNaN(num) && num > maxCustNum) maxCustNum = num;
  }
  
  const rpcRes = await fetch(`${prodUrl}/rest/v1/rpc/fn_sync_customer_code_seq`, {
    method: "POST",
    headers,
    body: JSON.stringify({ p_val: maxCustNum }),
  });

  if (rpcRes.ok) {
    const syncedVal = await rpcRes.json();
    console.log(`\n  ✓ customer_code_seq successfully synchronized to: ${syncedVal} (Next generated customer will be CUST-${String(syncedVal + 1).padStart(5, "0")}).`);
  } else {
    const rpcErr = await rpcRes.text();
    console.warn(`\n  ! Sequence RPC warning: ${rpcErr}`);
  }

  console.log("\n================================================================================");
  console.log("=== PRODUCTION INGESTION COMPLETE: ZERO ERRORS ===");
  console.log(`=== CUSTOMERS INGESTED: ${customerIdMap.size} | TRIPS INGESTED: ${totalTripsInserted} ===`);
  console.log("================================================================================\n");
}

runIngestion().catch((err) => {
  console.error("\nFATAL INGESTION ERROR:", err);
  process.exit(1);
});
