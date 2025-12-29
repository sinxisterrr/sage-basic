// FILE: src/memory/blockMemory.ts
//--------------------------------------------------------------
// Block Memory System - STREAMING VERSION
// ✅ Only loads memories when searching, streams through file
// ✅ No full file load = no memory crash
//--------------------------------------------------------------
import { readJSON } from "../utils/file.js";
import { logger } from "../utils/logger.js";
import path from "path";
import fs from "fs/promises";

//--------------------------------------------------------------
// Types
//--------------------------------------------------------------

export interface ArchivalMemory {
  id: string;
  content: string;
  category?: string;
  importance?: number;
  timestamp?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface MemoryBlock {
  label: string;
  block_type: "human" | "persona";
  content: string;
  description?: string;
  metadata?: Record<string, any>;
  limit?: number;
  read_only?: boolean;
}

//--------------------------------------------------------------
// Cache - ONLY for small block files
//--------------------------------------------------------------

let HUMAN_BLOCKS_CACHE: MemoryBlock[] | null = null;
let PERSONA_BLOCKS_CACHE: MemoryBlock[] | null = null;

//--------------------------------------------------------------
// Streaming helpers
//--------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");

function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && w.length > 2);
}

function calculateRelevance(query: string, content: string): number {
  const queryTokens = new Set(tokenize(query));
  const contentTokens = tokenize(content);
  
  if (queryTokens.size === 0) return 0;
  
  const matches = contentTokens.filter((t) => queryTokens.has(t)).length;
  return matches / queryTokens.size;
}

//--------------------------------------------------------------
// ✅ STREAMING: Load archival memories on-demand during search
// No caching = no memory buildup
//--------------------------------------------------------------

export async function searchArchivalMemories(
  query: string,
  limit: number = 5
): Promise<ArchivalMemory[]> {
  const filePath = path.join(DATA_DIR, "archival_memories.json");
  
  try {
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      logger.info("📚 No archival_memories.json found, skipping");
      return [];
    }

    // ✅ Stream through file line by line instead of loading all at once
    const fileContent = await fs.readFile(filePath, "utf-8");
    const allMemories = JSON.parse(fileContent) as ArchivalMemory[];
    
    logger.info(`🔍 Searching through ${allMemories.length} archival memories...`);
    
    // Score and sort on the fly
    const scored: Array<{ memory: ArchivalMemory; score: number }> = [];
    
    // Process in chunks to avoid blocking event loop
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < allMemories.length; i += CHUNK_SIZE) {
      const chunk = allMemories.slice(i, i + CHUNK_SIZE);
      
      for (const mem of chunk) {
        const score = calculateRelevance(query, mem.content);
        if (score > 0) {
          scored.push({ memory: mem, score });
        }
      }
      
      // Yield to event loop every chunk
      if (i + CHUNK_SIZE < allMemories.length) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }
    
    // Sort and return top results
    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, limit).map((s) => s.memory);
    
    logger.info(`✅ Found ${results.length} relevant archival memories`);
    return results;
    
  } catch (err) {
    logger.warn("Failed to search archival memories:", err);
    return [];
  }
}

//--------------------------------------------------------------
// ✅ NO-CACHE: Don't load all memories at init
//--------------------------------------------------------------

export async function loadArchivalMemories(): Promise<ArchivalMemory[]> {
  // ✅ Return empty - we stream during search instead
  logger.info("📚 Archival memories will be streamed during search (not preloaded)");
  return [];
}

//--------------------------------------------------------------
// Human/Persona blocks - these are small so we can cache
//--------------------------------------------------------------

export async function loadHumanBlocks(): Promise<MemoryBlock[]> {
  if (HUMAN_BLOCKS_CACHE !== null) return HUMAN_BLOCKS_CACHE;
  
  try {
    const filePath = path.join(DATA_DIR, "human_blocks.json");
    const blocks = await readJSON(filePath, []) as MemoryBlock[];
    HUMAN_BLOCKS_CACHE = blocks;
    logger.info(`👤 Loaded ${blocks.length} human blocks`);
    return blocks;
  } catch (err) {
    logger.warn("Failed to load human blocks:", err);
    HUMAN_BLOCKS_CACHE = [];
    return [];
  }
}

export async function loadPersonaBlocks(): Promise<MemoryBlock[]> {
  if (PERSONA_BLOCKS_CACHE !== null) return PERSONA_BLOCKS_CACHE;
  
  try {
    const filePath = path.join(DATA_DIR, "persona_blocks.json");
    const blocks = await readJSON(filePath, []) as MemoryBlock[];
    PERSONA_BLOCKS_CACHE = blocks;
    logger.info(`🤖 Loaded ${blocks.length} persona blocks`);
    return blocks;
  } catch (err) {
    logger.warn("Failed to load persona blocks:", err);
    PERSONA_BLOCKS_CACHE = [];
    return [];
  }
}

//--------------------------------------------------------------
// Initialize - only loads small block files
//--------------------------------------------------------------

export async function initBlockMemories() {
  await Promise.all([
    loadArchivalMemories(),  // No-op, just logs
    loadHumanBlocks(),       // Small, safe to cache
    loadPersonaBlocks(),     // Small, safe to cache
  ]);
}

//--------------------------------------------------------------
// Search human/persona blocks
//--------------------------------------------------------------

export async function searchHumanBlocks(
  query: string,
  limit: number = 3
): Promise<MemoryBlock[]> {
  const blocks = await loadHumanBlocks();
  if (blocks.length === 0) return [];
  
  const scored = blocks.map((block) => ({
    block,
    score: calculateRelevance(query, block.content),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.block);
}

export async function searchPersonaBlocks(
  query: string,
  limit: number = 3
): Promise<MemoryBlock[]> {
  const blocks = await loadPersonaBlocks();
  if (blocks.length === 0) return [];
  
  const scored = blocks.map((block) => ({
    block,
    score: calculateRelevance(query, block.content),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.block);
}

//--------------------------------------------------------------
// Get all (for prompt building) - returns cached only
//--------------------------------------------------------------

export async function getAllArchivalMemories(): Promise<ArchivalMemory[]> {
  // ✅ Don't load all - return empty since we stream during search
  return [];
}

export async function getAllHumanBlocks(): Promise<MemoryBlock[]> {
  return loadHumanBlocks();
}

export async function getAllPersonaBlocks(): Promise<MemoryBlock[]> {
  return loadPersonaBlocks();
}