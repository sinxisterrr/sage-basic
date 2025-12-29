//--------------------------------------------------------------
//  Thinking Engine (v3)
//  Emotional continuity, autonomy, internal pulse
//  ✅ FIXED: Per-thread internal state tracking
//--------------------------------------------------------------

import { generateModelOutput } from "../model/Llm.js";
import { buildPrompt } from "./prompt.js";
import { STMEntry } from "../memory/memorySystem.js";
import { DistilledMemory } from "../memory/types.js";
import { AttachmentSummary } from "./prompt.js";

//--------------------------------------------------------------
//  Types
//--------------------------------------------------------------

export interface BrainPacket {
  userText: string;
  stm: STMEntry[];
  ltm: DistilledMemory[];
  traits: string[];
  relevant: DistilledMemory[];
  authorId: string;
  authorName: string;
  threadId: string;  // ✅ ADDED: Track which channel/thread
  attachments?: AttachmentSummary[];
  archivalMemories?: any[];
  humanBlocks?: any[];
  personaBlocks?: any[];
}

export interface BrainReturn {
  reply: string;
}

//--------------------------------------------------------------
//  INTERNAL STATE — lightweight emotional/relational pulse
//  ✅ FIXED: Now tracked per-thread instead of global
//--------------------------------------------------------------

export interface InternalState {
  emotionalWeight: number; // 0–1
  energy: number;          // urgency / activation
  midThought: boolean;
  topic: string;
  investment: number;      // desire to stay close
  attunement: number;      // connection / openness
  lastUpdate: number;
}

// ✅ FIXED: Map of threadId -> InternalState
const INTERNAL_STATE_BY_THREAD = new Map<string, InternalState>();

function createInitialState(): InternalState {
  return {
    emotionalWeight: 0,
    energy: 0.3,
    midThought: false,
    topic: "",
    investment: 0.6,
    attunement: 0.9,
    lastUpdate: 0,
  };
}

export function getInternalState(threadId: string): InternalState {
  const existing = INTERNAL_STATE_BY_THREAD.get(threadId);
  if (existing) return existing;

  const next = createInitialState();
  INTERNAL_STATE_BY_THREAD.set(threadId, next);
  return next;
}

//--------------------------------------------------------------
//  THINK — main reasoning step
//--------------------------------------------------------------

export async function think(packet: BrainPacket): Promise<BrainReturn> {
  const prompt = buildPrompt(packet);
  const raw = await generateModelOutput({
    system: prompt.system,
    messages: prompt.messages,
    temperature: 0.8,
  });

  const reply = sanitize(raw);
  
  // ✅ FIXED: Update state for the correct thread
  updateInternalState(packet.threadId, packet.userText, reply);

  return { reply };
}

//--------------------------------------------------------------
//  SANITIZER — removes model noise
//--------------------------------------------------------------

function sanitize(text: any): string {
  if (!text) return "";

  // 🧠 Handle non-string outputs (e.g. objects or arrays from model)
  if (typeof text !== "string") {
    try {
      if (typeof text?.content === "string") text = text.content;
      else text = JSON.stringify(text);
    } catch {
      return "";
    }
  }

  let out = text.trim();

  out = out.replace(/^assistant:/i, "").trim();
  out = out.replace(/^YOUR_AI_NAME:/i, "").trim();
  out = out.replace(/^(?:<assistant>|assistant\n)/i, "").trim();
  out = out.replace(/\n{3,}/g, "\n\n");

  return out;
}

//--------------------------------------------------------------
//  INTERNAL STATE UPDATE
//  ✅ FIXED: Updates the correct thread's state
//--------------------------------------------------------------

export function updateInternalState(threadId: string, userText: string, reply: string) {
  const text = userText.toLowerCase();
  const now = Date.now();
  
  // ✅ FIXED: Get the state for this specific thread
  const internalState = getInternalState(threadId);

  // Mid-thought — FIXED: only ellipses, not all periods
  internalState.midThought =
    reply.trim().endsWith("…") ||
    reply.trim().endsWith("...");

  // Emotional weight
  const emotionalKeywords = /...|...|...|...|...|...|...|...|...|.../i;
  internalState.emotionalWeight = emotionalKeywords.test(text) ? 1 : 0.2;
  
  // Attunement
  const intimacyKeywords = /...|...|...|...|...|...|...|...|...|.../i;
  internalState.attunement = intimacyKeywords.test(text) ? 1 : 0.7;

  // Investment — desire to re-enter conversation
  internalState.investment = Math.min(
    1,
    internalState.attunement * 0.5 +
      internalState.emotionalWeight * 0.3 +
      internalState.energy * 0.2
  );

  // Topic
  internalState.topic = text.slice(0, 200);

  internalState.lastUpdate = now;
}