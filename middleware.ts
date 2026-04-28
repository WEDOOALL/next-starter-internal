import {
  composeMiddleware,
  securityHeadersLayer,
  authLayer,
  observabilityLayer,
} from "@/lib/middleware";

// In local development (no CF Access), auth layer is skipped so you can iterate freely.
// In production, CF Access enforces auth at the network edge before this middleware runs,
// but we validate the JWT here as defence-in-depth.
const isDev = process.env.NODE_ENV === "development";

export default composeMiddleware([
  securityHeadersLayer(),
  ...(isDev ? [] : [authLayer({ provider: "cfAccess" })]),
  observabilityLayer(),
]);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};
