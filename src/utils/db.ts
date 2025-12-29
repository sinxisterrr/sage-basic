//--------------------------------------------------------------
// Postgres connection + schema guard
//--------------------------------------------------------------

import { Pool } from "pg";
import { logger } from "./logger.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Postgres is not configured. Please set DATABASE_URL in your environment."
  );
}

const useSsl = connectionString.includes("sslmode=require");

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

logger.info("🗄️ Postgres client initialized.");

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: Array<string | number | boolean | object | null> = []
) {
  return pool.query<T>(text, params);
}

let botMemoryReady = false;

export async function ensureBotMemoryTable() {
  if (botMemoryReady) return;

  await pool.query(
    `
      CREATE TABLE IF NOT EXISTS bot_memory (
        bot_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        ltm JSONB NOT NULL,
        traits JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (bot_id, user_id)
      )
    `
  );

  botMemoryReady = true;
}
