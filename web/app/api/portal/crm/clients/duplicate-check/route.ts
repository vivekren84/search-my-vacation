import { NextResponse } from "next/server";
import { clientCrmService } from "@/lib/staff-portal/crm/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || undefined;
    const phone = searchParams.get("phone") || undefined;

    const result = clientCrmService.detectDuplicate({ email, phone });
    return NextResponse.json({ ok: true, duplicate: result });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message || "Failed to check duplicates." },
      { status: 500 }
    );
  }
}
