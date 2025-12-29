// src/client/Client.ts
//--------------------------------------------------------------
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { loadEnv } from "../utils/env.js";
import { logger } from "../utils/logger.js";
import { registerEvents } from "../discord/events/index.js";

export class DiscClient extends Client {
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel],
    });
  }

  async start() {
    const { DISCORD_BOT_TOKEN } = loadEnv();

    // REMOVED: Memory init happens in ready event, not here
    // This prevents double initialization

    this.once("ready", () => {
      logger.info(`✨ Connected as ${this.user?.tag}`);

      this.heartbeatInterval = setInterval(() => {
        this.emit("heartbeat");
      }, 30_000);
    });

    // Pass 'this' directly - TypeScript will figure it out
    registerEvents(this);

    try {
      await this.login(DISCORD_BOT_TOKEN);
    } catch (err) {
      logger.error("❌ Login failed:", err);
      throw err;
    }

    process.on("SIGINT", async () => {
      logger.info("👋 Shutting down…");
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      process.exit(0);
    });
  }
}