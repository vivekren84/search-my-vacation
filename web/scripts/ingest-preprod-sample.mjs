/**
 * Search My Vacation (SMV) — Release 1.5.1 Pre-Prod Test Data Ingestion
 *
 * Ingests 5 curated customer profiles & trips to test:
 * 1. Customer deduplication & multi-year repeat traveller linking (Senthu Chandran)
 * 2. Vendor deal channel prefix generation (VDSMV-26-015 for Shree Lakshmi)
 * 3. Dual mobile number parsing & storage + Anand lead attribution (Harini / Lalitha)
 * 4. Legacy past entry ingestion (Hariharan Ravichandran DDSMV-24-P026)
 * 5. Lead attribution to Keerthi + 2025 deal (Balaji Hariharan DDSMV-25-067)
 * 6. Sequence synchronization in deal_id_sequences table
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment from web/.env.local if not already set
const envPath = resolve(__dirname, "../.env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const k = match[1];
      let v = match[2] || "";
      v = v.replace(/^['"]|['"]$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pkfdunyeaqdvvklutgon.supabase.co";
const key = process.env.SUPABASE_SECRET_KEY;

if (!key) {
  console.error("SUPABASE_SECRET_KEY is required in environment or web/.env.local");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// Staff UUIDs
const STAFF = {
  vivek: "89782ecc-b5f9-4e44-b9e5-db3e310a933e",
  dinesh: "a1d7bade-59fe-430b-bad6-364451a62be1",
  anand: "f214ec92-9923-4a88-a7ec-fb494be3ae5d",
  keerthi: "c351b2e1-3d89-4d20-9b39-aaa86f8eac11",
};

async function main() {
  console.log("=== INGESTING CURATED PRE-PROD CRM TEST RECORDS ===");

  // 1. Senthu Chandran (Repeat customer with 2 trips: 2026 Vietnam + 2027 Singapore)
  console.log("\n1. Ingesting Senthu Chandran...");
  const senthuCustRes = await fetch(`${url}/rest/v1/workspace_customers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      primary_name: "Senthu Chandran",
      primary_mobile: "+917338757911",
      primary_email: "senthu.c@gmail.com",
      created_by_user_id: STAFF.vivek,
    }),
  });
  const [senthuCust] = await senthuCustRes.json();
  console.log("  Created Customer:", senthuCust.customer_code, senthuCust.primary_name, senthuCust.id);

  // Senthu Trip 1: DDSMV-26-083
  const senthuTrip1Res = await fetch(`${url}/rest/v1/workspace_trips`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer_id: senthuCust.id,
      deal_reference_id: "DDSMV-26-083",
      deal_channel: "DIRECT",
      lead_owner_id: STAFF.vivek,
      destination: "Vietnam",
      travel_year: 2026,
      travel_month: "April",
      duration_label: "6N/7D",
      nights: 6,
      travel_party_type: "Family",
      pax_adults: 4,
      pax_children: 2,
      deal_stage: "Booked/Won",
      payment_status: "Won",
      trip_status: "Complete",
      booked_properties: "Continental Citizen",
      booked_transport: "Continental Citizen",
      notes: "Trip complete",
      actual_cost: 301063.0,
      quote_price: 372540.0,
      pre_tax_amount: 354800.0,
      gst_amount: 17740.0,
      profit: 53737.0,
    }),
  });
  const [senthuTrip1] = await senthuTrip1Res.json();
  console.log("  Created Trip 1:", senthuTrip1.deal_reference_id, senthuTrip1.destination);

  // Senthu Trip 2: DDSMV-27-126 (repeat customer linking)
  const senthuTrip2Res = await fetch(`${url}/rest/v1/workspace_trips`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer_id: senthuCust.id,
      deal_reference_id: "DDSMV-27-126",
      deal_channel: "DIRECT",
      lead_owner_id: STAFF.vivek,
      destination: "Singapore",
      travel_year: 2027,
      travel_month: "March",
      duration_label: "4N/5D",
      nights: 4,
      travel_party_type: "Family",
      pax_adults: 2,
      pax_children: 1,
      deal_stage: "On Hold",
      payment_status: "On Hold",
      trip_status: "On Hold",
      booked_properties: "Mitways Tours & Travels",
      booked_transport: "Mitways",
      notes: "High level plan shared",
      actual_cost: 0,
      quote_price: 0,
      pre_tax_amount: 0,
      gst_amount: 0,
      profit: 0,
    }),
  });
  const [senthuTrip2] = await senthuTrip2Res.json();
  console.log("  Created Trip 2 (Repeat Link):", senthuTrip2.deal_reference_id, senthuTrip2.destination);

  // 2. Shree Lakshmi (Vendor deal channel: VDSMV-26-015)
  console.log("\n2. Ingesting Shree Lakshmi (Vendor Deal)...");
  const shreeCustRes = await fetch(`${url}/rest/v1/workspace_customers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      primary_name: "Shree Lakshmi",
      primary_mobile: "+919916265273",
      primary_email: null,
      created_by_user_id: STAFF.vivek,
    }),
  });
  const [shreeCust] = await shreeCustRes.json();
  console.log("  Created Customer:", shreeCust.customer_code, shreeCust.primary_name);

  const shreeTripRes = await fetch(`${url}/rest/v1/workspace_trips`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer_id: shreeCust.id,
      deal_reference_id: "VDSMV-26-015",
      deal_channel: "VENDOR",
      lead_owner_id: STAFF.vivek,
      destination: "Manali",
      travel_year: 2026,
      travel_month: "March",
      duration_label: "2N",
      nights: 2,
      travel_party_type: "Family",
      pax_adults: 2,
      pax_children: 2,
      deal_stage: "Booked/Won",
      payment_status: "Won",
      trip_status: "Complete",
      booked_properties: "Anand Vardhan",
      booked_transport: "NA",
      notes: "Trip complete",
      actual_cost: 14500.0,
      quote_price: 19600.0,
      pre_tax_amount: 18666.67,
      gst_amount: 0.0,
      profit: 5100.0,
    }),
  });
  const [shreeTrip] = await shreeTripRes.json();
  console.log("  Created Trip:", shreeTrip.deal_reference_id, shreeTrip.deal_channel, shreeTrip.destination);

  // 3. Harini / Lalitha (Dual Mobile split + Anand lead attribution)
  console.log("\n3. Ingesting Harini / Lalitha (Dual Mobile + Anand Lead)...");
  const hariniCustRes = await fetch(`${url}/rest/v1/workspace_customers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      primary_name: "Harini / Lalitha",
      primary_mobile: "+919663849775",
      secondary_mobile: "+919742291031",
      primary_email: "lallivramani@gmail.com",
      created_by_user_id: STAFF.anand,
    }),
  });
  const [hariniCust] = await hariniCustRes.json();
  console.log("  Created Customer:", hariniCust.customer_code, hariniCust.primary_mobile, hariniCust.secondary_mobile);

  const hariniTripRes = await fetch(`${url}/rest/v1/workspace_trips`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer_id: hariniCust.id,
      deal_reference_id: "DDSMV-26-136",
      deal_channel: "DIRECT",
      lead_owner_id: STAFF.anand,
      destination: "Rajasthan",
      travel_year: 2026,
      travel_month: "Oct",
      duration_label: "6N/7D",
      nights: 6,
      travel_party_type: "Family",
      pax_adults: 2,
      pax_children: 0,
      deal_stage: "Booked/Won",
      payment_status: "Won",
      trip_status: "Complete",
      booked_properties: "Crestmont Royals Raja Park, Rajwara, Colonial",
      booked_transport: "Royal Rajasthan Vacation",
      notes: "Trip complete",
      actual_cost: 123542.0,
      quote_price: 146350.0,
      pre_tax_amount: 139380.95,
      gst_amount: 0.0,
      profit: 22808.0,
    }),
  });
  const [hariniTrip] = await hariniTripRes.json();
  console.log("  Created Trip:", hariniTrip.deal_reference_id, "Lead:", hariniTrip.lead_owner_id);

  // 4. Hariharan Ravichandran (Legacy 2024 Past Entry)
  console.log("\n4. Ingesting Hariharan Ravichandran (Legacy 2024 Past Entry)...");
  const hariCustRes = await fetch(`${url}/rest/v1/workspace_customers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      primary_name: "Hariharan Ravichandran",
      primary_mobile: "+919578854396",
      primary_email: "hariharanravichandran17@gmail.com",
      created_by_user_id: STAFF.vivek,
    }),
  });
  const [hariCust] = await hariCustRes.json();
  console.log("  Created Customer:", hariCust.customer_code, hariCust.primary_name);

  const hariTripRes = await fetch(`${url}/rest/v1/workspace_trips`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer_id: hariCust.id,
      deal_reference_id: "DDSMV-24-P026",
      deal_channel: "DIRECT",
      lead_owner_id: STAFF.vivek,
      destination: "Mangalore",
      travel_year: 2024,
      travel_month: "December",
      duration_label: "3N/4D",
      nights: 3,
      travel_party_type: "Family",
      pax_adults: 5,
      pax_children: 1,
      deal_stage: "Booked/Won",
      payment_status: "Won",
      trip_status: "Complete",
      booked_properties: "Laxmi City Side, Royal Oak",
      booked_transport: "Mangalore Travel Corp",
      notes: "Complete",
      actual_cost: 52540.0,
      quote_price: 70560.0,
      pre_tax_amount: 67200.0,
      gst_amount: 3360.0,
      profit: 14660.0,
    }),
  });
  const [hariTrip] = await hariTripRes.json();
  console.log("  Created Trip:", hariTrip.deal_reference_id, hariTrip.travel_year, hariTrip.destination);

  // 5. Balaji Hariharan (Lead Attribution: Keerthi + 2025 Deal)
  console.log("\n5. Ingesting Balaji Hariharan (Keerthi Lead + 2025 Deal)...");
  const balajiCustRes = await fetch(`${url}/rest/v1/workspace_customers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      primary_name: "Balaji Hariharan",
      primary_mobile: "+919940432444",
      primary_email: "bala850316@gmail.com",
      created_by_user_id: STAFF.keerthi,
    }),
  });
  const [balajiCust] = await balajiCustRes.json();
  console.log("  Created Customer:", balajiCust.customer_code, balajiCust.primary_name);

  const balajiTripRes = await fetch(`${url}/rest/v1/workspace_trips`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer_id: balajiCust.id,
      deal_reference_id: "DDSMV-25-067",
      deal_channel: "DIRECT",
      lead_owner_id: STAFF.keerthi,
      destination: "Andaman",
      travel_year: 2025,
      travel_month: "October",
      duration_label: "3N/4D",
      nights: 3,
      travel_party_type: "Solo",
      pax_adults: 1,
      pax_children: 0,
      deal_stage: "Booked/Won",
      payment_status: "Won",
      trip_status: "Complete",
      booked_properties: "De Pebbles, Ocean Blue",
      booked_transport: "Scooty",
      notes: "Trip Complete",
      actual_cost: 42938.0,
      quote_price: 49960.0,
      pre_tax_amount: 47580.95,
      gst_amount: 250.0,
      profit: 6772.0,
    }),
  });
  const [balajiTrip] = await balajiTripRes.json();
  console.log("  Created Trip:", balajiTrip.deal_reference_id, "Lead:", balajiTrip.lead_owner_id);

  // 6. Synchronize deal_id_sequences
  console.log("\n6. Synchronizing deal_id_sequences counters...");
  const sequences = [
    { deal_channel: "DIRECT", year: 2026, last_val: 136 },
    { deal_channel: "VENDOR", year: 2026, last_val: 15 },
    { deal_channel: "DIRECT", year: 2027, last_val: 126 },
    { deal_channel: "DIRECT", year: 2025, last_val: 67 },
    { deal_channel: "DIRECT", year: 2024, last_val: 26 },
  ];

  for (const seq of sequences) {
    const seqRes = await fetch(`${url}/rest/v1/deal_id_sequences`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(seq),
    });
    console.log(`  Set sequence ${seq.deal_channel}-${seq.year} to ${seq.last_val}: ${seqRes.status}`);
  }

  // 7. Verify Travellers View
  const travRes = await fetch(`${url}/rest/v1/workspace_travellers?select=full_name,phone,email`, {
    headers,
  });
  const travellers = await travRes.json();
  console.log("\n7. Backward-compatible workspace_travellers View contains:", travellers.length, "travellers.");

  console.log("\n=== PRE-PROD CRM TEST INGESTION COMPLETED SUCCESSFULLY ===");
}

main().catch(console.error);
