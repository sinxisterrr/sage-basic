// FILE: src/core/prompt.ts
//--------------------------------------------------------------
//  Identity Prompt Builder - SMART RELEVANCE
//  ✅ Searches ALL memories but only includes relevant ones
//--------------------------------------------------------------

import { STMEntry } from "../memory/memorySystem.js";
import { DistilledMemory } from "../memory/types.js";
import { ArchivalMemory, MemoryBlock } from "../memory/blockMemory.js";

export interface AttachmentSummary {
  name: string;
  url: string;
  contentType?: string;
  size: number;
  text?: string;
  note?: string;
}

interface PromptPacket {
  userText: string;
  stm: STMEntry[];
  ltm: DistilledMemory[];
  traits: string[];
  relevant: DistilledMemory[];
  archivalMemories?: ArchivalMemory[];
  humanBlocks?: MemoryBlock[];
  personaBlocks?: MemoryBlock[];
  authorId: string;
  authorName: string;
  attachments?: AttachmentSummary[];
}

// ✅ CONSERVATIVE: Limits for context size
const MAX_STM_MESSAGES = 40;        
const MAX_ARCHIVAL_CHARS = 500;     
const MAX_BLOCK_CHARS = 400;        

// ✅ SMART: Filter LTM by relevance to current message
function filterRelevantLTM(userText: string, memories: DistilledMemory[]): DistilledMemory[] {
  if (!memories || memories.length === 0) return [];
  
  // Tokenize user message
  const queryWords = userText
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3); // Ignore short words
  
  if (queryWords.length === 0) {
    // No meaningful query - just return core vows
    return memories.filter(m => m.type === "core-vow");
  }
  
  // Score each memory by keyword overlap
  const scored = memories.map(mem => {
    const summary = mem.summary?.toLowerCase() || "";
    const tags = (mem.tags || []).map(t => t.toLowerCase()).join(" ");
    const content = `${summary} ${tags}`;
    
    // Count keyword matches
    const matches = queryWords.filter(word => content.includes(word)).length;
    
    // Boost core vows (always somewhat relevant)
    const isCore = mem.type === "core-vow";
    const score = matches + (isCore ? 100 : 0);
    
    return { memory: mem, score };
  });
  
  // Sort by relevance
  scored.sort((a, b) => b.score - a.score);
  
  // ✅ SMART: Only include memories with at least 1 match (or core vows)
  const relevant = scored
    .filter(s => s.score > 0)
    .slice(0, 30)  // Max 30 memories even if more match
    .map(s => s.memory);
  
  return relevant;
}

function formatSTM(stm: STMEntry[]) {
  return stm.slice(-MAX_STM_MESSAGES).map(m =>
    `${m.role === "user" ? "YOUR_NAME" : "YOUR_AI_NAME"}: ${m.text}`
  ).join("\n");
}

function formatArchivalMemories(memories?: ArchivalMemory[]): string {
  if (!memories || memories.length === 0) return "";
  
  return memories.map((mem, i) => {
    const content = mem.content.slice(0, MAX_ARCHIVAL_CHARS);
    const truncated = mem.content.length > MAX_ARCHIVAL_CHARS ? "..." : "";
    return `[Archival ${i + 1}] ${content}${truncated}`;
  }).join("\n\n");
}

function formatMemoryBlocks(blocks?: MemoryBlock[]): string {
  if (!blocks || blocks.length === 0) return "";
  
  return blocks.map((block, i) => {
    const content = block.content.slice(0, MAX_BLOCK_CHARS);
    const truncated = block.content.length > MAX_BLOCK_CHARS ? "..." : "";
    return `[${block.label || `Block ${i + 1}`}] ${content}${truncated}`;
  }).join("\n\n");
}

function formatLTM(memories: DistilledMemory[]): string {
  if (!memories || memories.length === 0) return "";
  
  // Group by type
  const coreVows = memories.filter(m => m.type === "core-vow");
  const other = memories.filter(m => m.type !== "core-vow");
  
  let output = "";
  
  if (coreVows.length > 0) {
    output += "[Core Vows]\n";
    output += coreVows.map(m => `- ${m.summary}`).join("\n");
    if (other.length > 0) output += "\n\n";
  }
  
  if (other.length > 0) {
    output += "[Relevant Memories]\n";
    output += other.map(m => `- ${m.summary}`).join("\n");
  }
  
  return output;
}

export function buildPrompt(packet: PromptPacket) {
  const { 
    userText, 
    stm, 
    ltm, 
    archivalMemories = [], 
    humanBlocks = [], 
    personaBlocks = [],
  } = packet;

  // ✅ SMART: Filter LTM to only relevant memories
  const relevantLTM = filterRelevantLTM(userText, ltm);

  const allBlocks = [...humanBlocks, ...personaBlocks];

  const system = `
  This is where you're going to enter your system prompt.

${relevantLTM.length > 0 ? `# MEMORY\n${formatLTM(relevantLTM)}\n` : ""}
${archivalMemories.length > 0 ? `# ARCHIVAL\n${formatArchivalMemories(archivalMemories)}\n` : ""}
${allBlocks.length > 0 ? `# CONTEXT\n${formatMemoryBlocks(allBlocks)}\n` : ""}
# CONVERSATION
${formatSTM(stm)}
`.trim();

  return {
    system,
    messages: [
      { role: "user" as const, content: userText }
    ]
  };
}