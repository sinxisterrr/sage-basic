//--------------------------------------------------------------
// Environment loader — typed and safe
//--------------------------------------------------------------

import dotenv from "dotenv";
dotenv.config();

export interface EnvConfig {
  DISCORD_BOT_TOKEN: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL: string;
  MODEL_PROVIDER: string;
  VISION_ENABLED?: string;
  OLLAMA_MODEL?: string;
  OLLAMA_BASE_URL?: string;
  OLLAMA_API_KEY?: string;
  CLAUDE_API_KEY?: string;
  CLAUDE_MODEL?: string;
  RUNPOD_OLLAMA_URL?: string;
  RUNPOD_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
}

export function loadEnv(): EnvConfig {
  const {
    DISCORD_BOT_TOKEN,
    OPENAI_API_KEY,
    OPENAI_MODEL,
    MODEL_PROVIDER,
    VISION_ENABLED,
    OLLAMA_MODEL,
    OLLAMA_BASE_URL,
    OLLAMA_API_KEY,
    CLAUDE_API_KEY,
    CLAUDE_MODEL,
    RUNPOD_OLLAMA_URL,
    RUNPOD_API_KEY,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
  } = process.env;

  if (!DISCORD_BOT_TOKEN) {
    throw new Error("Missing DISCORD_BOT_TOKEN - get one from https://discord.com/developers/applications");
  }

  if (!MODEL_PROVIDER) {
    throw new Error(
      "Missing MODEL_PROVIDER - set to 'openai', 'openrouter', 'ollama', or 'claude'"
    );
  }

  const provider = MODEL_PROVIDER.toLowerCase();

  // Validate provider-specific requirements
  if (provider === "openai" && !OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY for OpenAI provider");
  }

  if (provider === "openrouter" && !OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY for OpenRouter provider");
  }

  if (provider === "claude" && !CLAUDE_API_KEY) {
    throw new Error("Missing CLAUDE_API_KEY for Claude provider");
  }

  if (provider === "ollama" && !OLLAMA_MODEL) {
    throw new Error("Missing OLLAMA_MODEL for Ollama provider");
  }

  return {
    DISCORD_BOT_TOKEN,
    OPENAI_API_KEY,
    OPENAI_MODEL: OPENAI_MODEL || "gpt-5.1",

    MODEL_PROVIDER: provider,
    VISION_ENABLED,

    OLLAMA_MODEL,
    OLLAMA_BASE_URL,
    OLLAMA_API_KEY,

    CLAUDE_API_KEY,
    CLAUDE_MODEL: CLAUDE_MODEL || "claude-3-sonnet-20240229",

    RUNPOD_OLLAMA_URL,
    RUNPOD_API_KEY,

    OPENROUTER_API_KEY,
    OPENROUTER_MODEL: OPENROUTER_MODEL,
    
  };
}
