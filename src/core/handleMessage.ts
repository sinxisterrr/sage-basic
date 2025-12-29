// FILE: src/core/handleMessage.ts
//--------------------------------------------------------------
// CONSERVATIVE - Stay well under 262k limit
//--------------------------------------------------------------

import { Message } from "discord.js";
import { logger } from "../utils/logger.js";

import {
  addToSTM,
  getSTM,
  getLTM,
  getTraits,
  maybeDistill,
  recallRelevantMemories,
  addManualMemory
} from "../memory/memorySystem.js";

import { loadLTM, loadTraits } from "../memory/memoryStore.js";
import {
  searchArchivalMemories,
  searchHumanBlocks,
  searchPersonaBlocks
} from "../memory/blockMemory.js";

import { think } from "./brain.js";
import { sendLargeMessage } from "../discord/sendLargeMessage.js";

type ManualMemoryCommand = {
  summary: string;
  type?: string;
  tags?: string[];
};

function parseManualMemoryCommand(text: string): ManualMemoryCommand | null {
  const match = text.match(
    /^(?:save\s+to\s+ltm|ltm(?:\s*save)?|remember\s+to\s+ltm)\s*(?:[:\-]\s*|\s+)(.+)$/i
  );
  
  if (!match) return null;
  const payload = match[1].trim();
  if (!payload) return null;

  const segments = payload.split("|").map((s) => s.trim());
  const summary = segments.shift();
  if (!summary) return null;

  let type: string | undefined;
  let tags: string[] | undefined;

  for (const seg of segments) {
    const lower = seg.toLowerCase();

    if (lower.startsWith("type")) {
      const [, rest] = seg.split(/type\s*[:=]/i);
      if (rest?.trim()) type = rest.trim();
    }

    if (lower.startsWith("tags")) {
      const [, rest] = seg.split(/tags\s*[:=]/i);
      if (rest?.trim()) {
        tags = rest
          .split(/[,;]/)
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
  }

  return { summary, type, tags };
}

export async function handleMessage(message: Message): Promise<string | null> {
  const userText = message.content?.trim();
  if (!userText) return null;

  const userId = message.author.id;
  const threadId = message.channelId;
  
  logger.info(`📩 Message received from ${message.author.tag} (${userId}) in channel ${threadId}`);

  // Load user memory lazily
  await loadLTM(userId);
  await loadTraits(userId);

  const historyBeforeUser = getSTM(threadId);
  addToSTM(threadId, "user", userText);

  // Manual LTM command
  const manual = parseManualMemoryCommand(userText);
  if (manual) {
    try {
      const entry = await addManualMemory(userId, manual);
      const ack = `🔒 Locked to LTM: ${entry.summary}` +
        (entry.type ? ` (type: ${entry.type})` : "") +
        (entry.tags?.length ? ` [tags: ${entry.tags.join(", ")}]` : "");

      await sendLargeMessage(message, ack);
      addToSTM(threadId, "assistant", ack);
      await maybeDistill(userId, threadId);
      return ack;
    } catch (err) {
      logger.error("Failed manual LTM save:", err);
      const fail = "I couldn't write that to LTM. Try again in a moment.";
      await sendLargeMessage(message, fail);
      addToSTM(threadId, "assistant", fail);
      return fail;
    }
  }

  // ✅ CONSERVATIVE: Very limited searches to stay under token limit
  const [archivalMemories, humanBlocks, personaBlocks] = await Promise.all([
    searchArchivalMemories(userText, 3),   // Just 3 (was 5)
    searchHumanBlocks(userText, 2),        // Just 2 (was 3)
    searchPersonaBlocks(userText, 2),      // Just 2 (was 3)
  ]);

  const packet = {
    userText,
    stm: historyBeforeUser,
    ltm: getLTM(userId),
    traits: [],
    relevant: [],
    archivalMemories,
    humanBlocks,
    personaBlocks,
    authorId: message.author.id,
    authorName: message.author.username,
    threadId,
  };

  try {
    const { reply } = await think(packet);

    if (reply) {
      await sendLargeMessage(message, reply);
      addToSTM(threadId, "assistant", reply);
      await maybeDistill(userId, threadId);
    }

    return reply || null;
  } catch (err) {
    logger.error("Brain error:", err);
    const fail = "Something glitched in my head for a second. Can you say that again?";
    await sendLargeMessage(message, fail);
    addToSTM(threadId, "assistant", fail);
    return fail;
  }
}