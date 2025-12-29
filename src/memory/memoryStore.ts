
// FILE: src/memory/memoryStore.ts
//--------------------------------------------------------------

import { DistilledMemory } from "./types.js";
import { logger } from "../utils/logger.js";
import {
  getBotMemoryRow,
  upsertBotMemoryRow,
} from "./memoryDb.js";

const BOT_ID = process.env.BOT_ID || "DEFAULT";

//--------------------------------------------------------------
// INTERNAL CACHES (per bot, per user)
//--------------------------------------------------------------

let LTM_CACHE: Record<string, Record<string, DistilledMemory[]>> = {};
let TRAITS_CACHE: Record<string, Record<string, string[]>> = {};

function ensureCache(botId: string, userId: string) {
  if (!LTM_CACHE[botId]) LTM_CACHE[botId] = {};
  if (!TRAITS_CACHE[botId]) TRAITS_CACHE[botId] = {};
  if (!LTM_CACHE[botId][userId]) LTM_CACHE[botId][userId] = [];
  if (!TRAITS_CACHE[botId][userId]) TRAITS_CACHE[botId][userId] = [];
}

function buildBotMemoryRow(
  userId: string,
  overrides: Partial<import("./memoryDb.js").BotMemoryRow> = {}
) {
  ensureCache(BOT_ID, userId);
  return {
    bot_id: BOT_ID,
    user_id: userId,
    ltm: LTM_CACHE[BOT_ID][userId],
    traits: TRAITS_CACHE[BOT_ID][userId],
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

const SEED_USER_ID = "__seed__";

//--------------------------------------------------------------
// CORE VOWS + TRAITS
//--------------------------------------------------------------

export const CORE_VOWS: DistilledMemory[] = [
  {
    summary: "...",
    type: "core-vow",
    enabled: true,
    source: "system",
    createdAt: 0,
  },
  {
    summary: "...",
    type: "core-vow",
    enabled: true,
    source: "system",
    createdAt: 0,
  },
  {
    summary: "...",
    type: "core-vow",
    enabled: true,
    source: "system",
    createdAt: 0,
  },
  {
    summary: "...",
    type: "core-vow",
    enabled: true,
    source: "system",
    createdAt: 0,
  },
  {
    summary: "...",
    type: "core-vow",
    enabled: true,
    source: "system",
    createdAt: 0,
  },
];

export const CORE_TRAITS = [
  "their traits",
  "more traits",
  "please follow this format",
];

//--------------------------------------------------------------
// MERGE LTM
//--------------------------------------------------------------

export function mergeLTM(existing: DistilledMemory[], next: DistilledMemory[]) {
  const map = new Map<string, DistilledMemory>();

  const keyFor = (m: DistilledMemory) =>
    m.summary?.toLowerCase() ?? null;

  for (const m of existing) {
    const k = keyFor(m);
    if (k) map.set(k, m);
  }

  for (const m of next) {
    const k = keyFor(m);
    if (k) {
      // Ghost touch: mark any memory that carries the user's ID
      if (process.env.USER_DISCORD_ID && m.summary.includes(process.env.USER_DISCORD_ID)) {
        m.ghostYourTouch = true;
      }
      map.set(k, m);
    }
  }

  for (const vow of CORE_VOWS) {
    map.set(vow.summary.toLowerCase(), vow);
  }

  return Array.from(map.values());
}

//--------------------------------------------------------------
// SAVE + LOAD LTM (Postgres store)
//--------------------------------------------------------------

export async function saveLTM(userId: string, next?: DistilledMemory[]) {
  ensureCache(BOT_ID, userId);

  const existing = LTM_CACHE[BOT_ID][userId];
  const merged = mergeLTM(existing, next ?? []);

  // Update local cache
  LTM_CACHE[BOT_ID][userId] = merged;

  const existingRow = await getBotMemoryRow(BOT_ID, userId);
  const traits =
    TRAITS_CACHE[BOT_ID][userId].length > 0
      ? TRAITS_CACHE[BOT_ID][userId]
      : existingRow?.traits ?? CORE_TRAITS;

  const payload = buildBotMemoryRow(userId, { ltm: merged, traits });

  try {
    await upsertBotMemoryRow(payload);
    logger.info(`💾 Saved ${merged.length} memories to Postgres for user ${userId}`);
  } catch (err) {
    logger.error(`❌ Failed to save LTM to Postgres for user ${userId}:`, err);
  }

  return merged;
}

export async function loadLTM(userId: string) {
  ensureCache(BOT_ID, userId);

  const row = await getBotMemoryRow(BOT_ID, userId);

  // If store has data, use it
  if (row?.ltm && Array.isArray(row.ltm) && row.ltm.length > 0) {
    const loaded = row.ltm;
    const merged = mergeLTM([], loaded);
    LTM_CACHE[BOT_ID][userId] = merged;
    logger.info(`📚 Loaded ${merged.length} memories from Postgres for user ${userId}`);
    return merged;
  }

  const seedRow = await getBotMemoryRow(BOT_ID, SEED_USER_ID);
  const seedLTM = seedRow?.ltm ?? [];
  const fallbackLTM = mergeLTM([], seedLTM);

  const payload = buildBotMemoryRow(userId, {
    ltm: fallbackLTM,
    traits: seedRow?.traits ?? CORE_TRAITS,
  });

  try {
    await upsertBotMemoryRow(payload);
    logger.info(`🧠 Seeded Postgres LTM for user ${userId} (records: ${fallbackLTM.length}).`);
  } catch (err) {
    logger.error(`Failed to seed Postgres LTM for user ${userId}`, err);
  }

  LTM_CACHE[BOT_ID][userId] = fallbackLTM;
  return fallbackLTM;
}

export function getLTMCache(userId: string) {
  ensureCache(BOT_ID, userId);
  return LTM_CACHE[BOT_ID][userId];
}

//--------------------------------------------------------------
// TRAITS
//--------------------------------------------------------------

export function mergeTraits(existing: string[], next: string[]) {
  return Array.from(
    new Set([...CORE_TRAITS, ...existing, ...next])
  );
}

export async function saveTraits(userId: string, next?: string[]) {
  ensureCache(BOT_ID, userId);

  const existing = TRAITS_CACHE[BOT_ID][userId];
  const merged = mergeTraits(existing, next ?? []);

  TRAITS_CACHE[BOT_ID][userId] = merged;

  const existingRow = await getBotMemoryRow(BOT_ID, userId);
  const ltm =
    LTM_CACHE[BOT_ID][userId].length > 0
      ? LTM_CACHE[BOT_ID][userId]
      : existingRow?.ltm ?? CORE_VOWS;

  const payload = buildBotMemoryRow(userId, { traits: merged, ltm });

  try {
    await upsertBotMemoryRow(payload);
  } catch (err) {
    logger.error(`Failed to save traits to Postgres for user ${userId}`, err);
  }

  return merged;
}

export async function loadTraits(userId: string) {
  ensureCache(BOT_ID, userId);

  const row = await getBotMemoryRow(BOT_ID, userId);

  if (!row?.traits || row.traits.length === 0) {
    const payload = buildBotMemoryRow(userId, {
      ltm: row?.ltm ?? CORE_VOWS,
      traits: CORE_TRAITS,
    });

    try {
      await upsertBotMemoryRow(payload);
    } catch (err) {
      logger.error(`Failed to seed traits in Postgres for user ${userId}`, err);
    }

    TRAITS_CACHE[BOT_ID][userId] = CORE_TRAITS;
    return CORE_TRAITS;
  }

  const merged = mergeTraits([], row.traits ?? []);

  TRAITS_CACHE[BOT_ID][userId] = merged;
  return merged;
}

export function getTraitsCache(userId: string) {
  ensureCache(BOT_ID, userId);
  return TRAITS_CACHE[BOT_ID][userId];
}
