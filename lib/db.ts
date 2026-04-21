import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });

export const db = pool;

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await pool.query<T>(sql, params);
  return result.rows;
}
