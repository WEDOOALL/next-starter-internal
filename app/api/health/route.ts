import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Healthcheck endpoint — contract enforced by FORGE pattern internal-app.
 *
 * Returns:
 *   200 { status: "healthy",   checks: {...}, version }   — all systems OK
 *   503 { status: "degraded",  checks: {...}, version }   — at least one check failed
 *
 * Used by:
 *  - Coolify health monitoring (deployment failure if 503)
 *  - forge-ops idle/wake policy (cf. docs/forge-ops.md)
 *  - external uptime monitoring (e.g. UptimeRobot)
 *
 * Each app extends this with app-specific checks (e.g. queue depth, external API).
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface HealthResponse {
  status: "healthy" | "degraded";
  checks: Record<string, "ok" | "fail">;
  version: string;
  timestamp: string;
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const checks: Record<string, "ok" | "fail"> = {};

  // ─── Supabase connectivity ────────────────────────────────────────────────
  try {
    const sb = await createSupabaseServerClient();
    // healthcheck is a no-RLS table created by the provisioning runbook
    const { error } = await sb.from("healthcheck").select("id").limit(1);
    checks["supabase"] = error ? "fail" : "ok";
  } catch {
    checks["supabase"] = "fail";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      checks,
      version: process.env["GIT_SHA"] ?? "dev",
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 },
  );
}
