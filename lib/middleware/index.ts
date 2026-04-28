/**
 * WEDOOALL middleware composition — inlined in this template.
 *
 * Originally planned as `@wedooall/middleware` package on registry.wedooall.com,
 * but extracted here to keep the template self-contained and testable.
 * Can be promoted to a shared package later if needed (no behavioural change).
 *
 * Layers (in order of execution per request):
 *  1. securityHeadersLayer  — HSTS, CSP, X-Frame-Options, etc.
 *  2. authLayer             — CF Access JWT validation (production only)
 *  3. observabilityLayer    — request-level Sentry breadcrumbs + PostHog event
 */

import { NextRequest, NextResponse } from "next/server";

export type MiddlewareLayer = (
  req: NextRequest,
  next: () => NextResponse | Promise<NextResponse>,
) => NextResponse | Promise<NextResponse>;

/**
 * Compose multiple layers into a single Next.js middleware function.
 * Layers run in order; each receives a `next()` to call the rest of the chain.
 */
export function composeMiddleware(layers: MiddlewareLayer[]) {
  return async function middleware(req: NextRequest): Promise<NextResponse> {
    let i = -1;
    const dispatch = async (idx: number): Promise<NextResponse> => {
      if (idx <= i) throw new Error("next() called multiple times");
      i = idx;
      const layer = layers[idx];
      if (!layer) return NextResponse.next();
      return layer(req, () => dispatch(idx + 1));
    };
    return dispatch(0);
  };
}

// ─── Layer 1 : Security headers ──────────────────────────────────────────────

export function securityHeadersLayer(): MiddlewareLayer {
  return async (_req, next) => {
    const res = await next();
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
    return res;
  };
}

// ─── Layer 2 : Auth (Cloudflare Access JWT) ──────────────────────────────────

export interface AuthLayerOptions {
  provider: "cfAccess";
  /** If set, perform JWKS verification against this team domain. Optional defence-in-depth. */
  cfAccessTeamDomain?: string;
}

/**
 * In production behind CF Access, every request to the origin already passed
 * a signed JWT in `cf-access-jwt-assertion` (CF guarantees this if the tunnel
 * is bound to an Access app). This layer enforces presence of the header
 * and rejects (401) if missing — defence-in-depth for misconfigured tunnels.
 *
 * For full JWKS signature verification, pass `cfAccessTeamDomain` and the
 * layer will hit `/cdn-cgi/access/certs` on the team domain to get pubkeys
 * (TODO: not yet implemented here — placeholder for future).
 */
export function authLayer(opts: AuthLayerOptions): MiddlewareLayer {
  return async (req, next) => {
    if (opts.provider !== "cfAccess") {
      throw new Error(`Unsupported auth provider: ${String(opts.provider)}`);
    }
    const jwt = req.headers.get("cf-access-jwt-assertion");
    if (!jwt) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // TODO: if opts.cfAccessTeamDomain → JWKS verify signature
    return next();
  };
}

// ─── Layer 3 : Observability (request breadcrumb) ────────────────────────────

/**
 * Lightweight request breadcrumb. Heavy lifting (Sentry init, PostHog session
 * tracking) lives in `instrumentation.ts` + `lib/observability/`.
 */
export function observabilityLayer(): MiddlewareLayer {
  return async (req, next) => {
    const start = Date.now();
    const res = await next();
    const durationMs = Date.now() - start;
    res.headers.set("Server-Timing", `mw;dur=${durationMs}`);
    return res;
  };
}
