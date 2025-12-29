//--------------------------------------------------------------
// Discord-safe message splitter
// Avoids: 50035 Invalid Form Body, 2000-char limit crashes,
// Unicode invisibles, and mid-word clipping.
// ✅ FIXED: Passes threadId for per-channel typing behavior
//--------------------------------------------------------------

import {
  Message,
  TextBasedChannel,
  GuildTextBasedChannel,
  DMChannel,
  PartialDMChannel
} from "discord.js";

import { estimateTypingTime, showTyping } from "./typing.js";
import { logger } from "../utils/logger.js";

//--------------------------------------------------------------
// Types
//--------------------------------------------------------------

type SendableChannel =
  | GuildTextBasedChannel
  | DMChannel
  | PartialDMChannel;

//--------------------------------------------------------------
// Clean splitter — prevents byte overflow + keeps words intact
//--------------------------------------------------------------

function splitForDiscord(text: string): string[] {
  // Strip zero-width characters that push byte length over 2000
  text = text.replace(/[\u200B-\u200D\uFEFF]/g, "");

  const MAX = 1900; // soft limit for UTF-8 safety
  const chunks: string[] = [];

  while (text.length > MAX) {
    let slice = text.slice(0, MAX);

    // Prefer splitting at the last space for readability
    const lastSpace = slice.lastIndexOf(" ");
    if (lastSpace > 500) {
      slice = slice.slice(0, lastSpace);
    }

    chunks.push(slice.trim());
    text = text.slice(slice.length).trim();
  }

  if (text.length > 0) {
    chunks.push(text.trim());
  }

  return chunks;
}

//--------------------------------------------------------------
// Main message-sending function with typing behavior
// ✅ FIXED: Uses channel ID for per-thread emotional typing
//--------------------------------------------------------------

export async function sendLargeMessage(
  source: Message | TextBasedChannel,
  text: string
) {
  const channel: SendableChannel =
    "channel" in source
      ? (source.channel as SendableChannel)
      : (source as SendableChannel);

  const chunks = splitForDiscord(text);
  logger.info(`📤 Sending reply (${chunks.length} chunk(s), ~${text.length} chars)`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    // ✅ FIXED: Pass channel.id as threadId for per-thread emotional state
    const typingTime = estimateTypingTime(chunk, channel.id);

    // Typing indicator — mood-adaptive
    await showTyping(channel, typingTime);
    await new Promise(res => setTimeout(res, typingTime));

    // First chunk uses reply() ONLY if source was a message
    if (i === 0 && "reply" in source) {
      await source.reply({ content: chunk });
    } else {
      await channel.send({ content: chunk });
    }
  }
}