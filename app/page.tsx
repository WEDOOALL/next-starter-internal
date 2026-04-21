import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

async function getOperatorEmail(): Promise<string> {
  const headersList = await headers();
  const jwt = headersList.get('cf-access-jwt-assertion');

  if (jwt) {
    try {
      const payload = jwtDecode<{ email?: string }>(jwt);
      return payload.email ?? 'unknown';
    } catch {
      // malformed JWT — fall through to default
    }
  }

  // Dev fallback — never reached in production behind CF Access
  return process.env['MOCK_OPERATOR_EMAIL'] ?? 'dev@local';
}

export default async function HomePage() {
  const email = await getOperatorEmail();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold tracking-tight">WEDOOALL Internal</h1>
      <p className="text-muted-foreground text-sm" data-testid="operator-email">
        Operator: <span className="font-medium">{email}</span>
      </p>
    </main>
  );
}
