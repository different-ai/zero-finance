import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";

// Initialize Drizzle with Vercel Postgres
export const db = drizzle(sql); 