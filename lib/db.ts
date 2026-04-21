import { Pool } from 'pg';

// Cache the Pool on globalThis to survive Next.js dev HMR reloads
// (each module re-evaluation would otherwise leak a new Pool → connection exhaustion).
const globalForPg = globalThis as unknown as { __pgPool?: Pool };

export const db: Pool =
  globalForPg.__pgPool ?? new Pool({ connectionString: process.env['DATABASE_URL'] });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPg.__pgPool = db;
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await db.query<T>(sql, params);
  return result.rows;
}
