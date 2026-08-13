import { NextResponse } from "next/server";
import { integrationStatus } from "@/lib/integrations";

/** GET /api/health — which pieces of the stack are configured. */
export function GET() {
  return NextResponse.json({
    ok: true,
    integrations: integrationStatus(),
  });
}
