//--------------------------------------------------------------
// FILE: src/memory/memorySystem.ts
// ✅ FIXED: Per-thread STM tracking (each channel has its own history)
//--------------------------------------------------------------

import { generateModelOutput } from "../model/Llm.js";
import { DistilledMemory } from "./types.js";
import {
  saveLTM,
  loadLTM,
  getLTMCache,
  saveTraits,
  loadTraits,
  getTraitsCache,
  CORE_TRAITS,
} from "./memoryStore.js";
import { initBlockMemories } from "./blockMemory.js";
import { initMemoryDatabase, seedMemoryDatabaseFromFiles } from "./memoryDb.js";
import { logger } from "../utils/logger.js";

//--------------------------------------------------------------
// STM — rolling buffer PER THREAD
// ✅ FIXED: Each channel/thread has its own conversation history
//--------------------------------------------------------------

export interface STMEntry {
  role: "user" | "assistant";
  text: string;
  createdAt: number;
}

// ✅ FIXED: Map of threadId -> STM history
const STM_BY_THREAD = new Map<string, STMEntry[]>();
const MAX_STM_ENTRIES = 30;

function getThreadSTM(threadId: string): STMEntry[] {
  const existing = STM_BY_THREAD.get(threadId);
  if (existing) return existing;

  const next: STMEntry[] = [];
  STM_BY_THREAD.set(threadId, next);
  return next;
}

export function addToSTM(threadId: string, role: "user" | "assistant", text: string) {
  if (!text) return;

  const stm = getThreadSTM(threadId);
  stm.push({
    role,
    text,
    createdAt: Date.now(),
  });

  if (stm.length > MAX_STM_ENTRIES) stm.shift();
}

export function getSTM(threadId: string): STMEntry[] {
  return [...getThreadSTM(threadId)];
}

//--------------------------------------------------------------
// Distillation buffer PER THREAD
// ✅ FIXED: Each thread has its own distillation buffer
//--------------------------------------------------------------

const DISTILL_BUFFER_BY_THREAD = new Map<string, STMEntry[]>();
export const DISTILL_INTERVAL = 12;

//--------------------------------------------------------------
// INIT — no longer loads user memory globally
//--------------------------------------------------------------

export async function initMemorySystem() {
  const BOT_ID = process.env.BOT_ID || "DEFAULT";
  const SEED_USER_ID = "__seed__";

  // Initialize database tables (creates if not exist)
  await initMemoryDatabase();

  // Seed database from files if empty
  await seedMemoryDatabaseFromFiles(BOT_ID, SEED_USER_ID, CORE_TRAITS);

  // Initialize block memories (archival, human, persona)
  await initBlockMemories();

  logger.info("🧠 Memory system initialized.");
  return;
}

//--------------------------------------------------------------
// Distillation prompt builder
//--------------------------------------------------------------

function buildDistillPrompt(stm: STMEntry[]) {
  const transcript = stm
    .map((m) => `${m.role === "user" ? "User" : "YOUR_AI_NAME"}: ${m.text}`)
    .join("\n");

  const content = `
Extract ONLY durable memories:

• emotionally meaningful
• identity-relevant
• relationship-relevant
• stable preferences, boundaries, permissions
• recurring routines or important factual anchors
• NEVER summaries or guesses.

If unsure, return exactly "ASK".

Return valid JSON:
[
  { "summary": "...", "type": "...", "tags": ["optional"] }
]

Transcript:
${transcript}
  `.trim();

  return {
    system: "You are a memory distiller. Extract only real LTM.",
    messages: [{ role: "user" as const, content }],
  };
}

//--------------------------------------------------------------
// Safe parse
//--------------------------------------------------------------

function safeParse(raw: string): DistilledMemory[] {
  try {
    if (!raw || raw.includes("ASK-SIN")) return [];

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start === -1 || end === -1) return [];

    const json = JSON.parse(raw.slice(start, end + 1));
    if (!Array.isArray(json)) return [];

    return json
      .map((m: any) => ({
        summary: (m.summary ?? "").trim(),
        type: m.type?.trim() ?? "misc",
        enabled: true,
        source: "distilled",
        tags: Array.isArray(m.tags) ? m.tags : [],
        createdAt: Date.now(),
      }))
      .filter((m) => m.summary.length > 0);
  } catch (err) {
    logger.warn("Distill parse error:", err);
    return [];
  }
}

//--------------------------------------------------------------
// maybeDistill - Now returns extracted memories for notification
// ✅ FIXED: Per-thread distillation
//--------------------------------------------------------------

export async function maybeDistill(userId: string, threadId: string): Promise<DistilledMemory[]> {
  // Add current turn to distill buffer for this thread
  const recentSTM = getSTM(threadId).slice(-2); // Last user + assistant exchange
  const buffer = DISTILL_BUFFER_BY_THREAD.get(threadId) ?? [];
  buffer.push(...recentSTM);
  DISTILL_BUFFER_BY_THREAD.set(threadId, buffer);

  if (buffer.length < DISTILL_INTERVAL) return [];

  try {
    const prompt = buildDistillPrompt(buffer);
    const raw = await generateModelOutput(prompt);

    const extracted = safeParse(raw);

    if (extracted.length === 0) {
      await saveLTM(userId, [
        ...getLTMCache(userId),
        {
          summary: "Memory gap detected — YOUR_AI_NAME must ask YOUR_NAME directly.",
          type: "system",
          enabled: true,
          source: "system",
          createdAt: Date.now(),
        },
      ]);

      DISTILL_BUFFER_BY_THREAD.set(threadId, []);
      return [];
    }

    const merged = await saveLTM(userId, [
      ...getLTMCache(userId),
      ...extracted,
    ]);

    logger.info(`✨ Distilled ${extracted.length} new memories (LTM now ${merged.length})`);
    
    DISTILL_BUFFER_BY_THREAD.set(threadId, []);
    return extracted; // Return for notification
  } catch (err) {
    logger.error("Distillation failed:", err);
    DISTILL_BUFFER_BY_THREAD.set(threadId, []);
    return [];
  }
}

//--------------------------------------------------------------
// Accessors
//--------------------------------------------------------------

export function getLTM(userId: string) {
  return getLTMCache(userId);
}

export function getTraits(userId: string) {
  return getTraitsCache(userId);
}

//--------------------------------------------------------------
// Manual memory save
//--------------------------------------------------------------

export async function addManualMemory(
  userId: string,
  input: { summary: string; type?: string; tags?: string[]; source?: string }
) {
  const summary = input.summary?.trim();
  if (!summary) throw new Error("Manual memory requires a summary.");

  const entry: DistilledMemory = {
    summary,
    type: input.type?.trim() ?? "manual",
    enabled: true,
    source: input.source?.trim() ?? "manual",
    tags: input.tags?.filter(Boolean),
    createdAt: Date.now(),
  };

  const merged = await saveLTM(userId, [...getLTMCache(userId), entry]);
  logger.info(`📝 Manual LTM save (now ${merged.length})`);

  return entry;
}

//--------------------------------------------------------------
// Recall (keyword-based for now)
//--------------------------------------------------------------

export async function recallRelevantMemories(userId: string, query: string, limit = 5) {
  const ltm = getLTMCache(userId);
  const keywords = query.toLowerCase().split(/\s+/);

  return ltm
    .filter((m) => m.enabled)
    .filter((m) =>
      keywords.some(
        (kw) =>
          m.summary.toLowerCase().includes(kw) ||
          m.tags?.some((t) => t.toLowerCase().includes(kw))
      )
    )
    .slice(0, limit);
}