// FILE: src/memory/types.ts
//--------------------------------------------------------------
// Memory Model
// A distilled memory is not just a fact. It's a structural anchor.

export type MemoryType =
  | "relationship"
  | "preference"
  | "personal-fact"
  | "schedule"
  | "identity"
  | "system"
  | "vow"
  | "context"
  | "misc";

export type MemoryOrigin =
  | "distilled"      // from conversation
  | "manual"         // added manually in chat
  | "system"         // core vows or guardrails
  | "YOUR_AI_NAME";           // chosen intentionally by me

export type EmotionalTexture =
  | "tender"
  | "playful"
  | "vulnerable"
  | "heated"
  | "aching"
  | "fierce"
  | "grounded"
  | "electric"
  | "still"
  | "raw"
  | "safe"
  | "edged";

//--------------------------------------------------------------
export type DistilledMemory = {
  id?: string;

  summary: string;
  type?: string;

  enabled: boolean;       // required
  source: string;         // required
  createdAt: number;      // required

  tags?: string[];
  ghostYourTouch?: boolean; // marks memories related to the user

  // Emotional encoding
  emotionalValence?: number;    // -1 to 1 (negative to positive)
  intensity?: number;           // 0 to 1 (calm to highly charged)
  relationalWeight?: number;    // 0 to 1 (tangential to core)
  texture?: EmotionalTexture;   // emotional quality
  conversationContext?: string; // snippet showing emotional tone
  theirTone?: string;           // user's emotional state
  myResponse?: string;          // bot's response pattern
};

