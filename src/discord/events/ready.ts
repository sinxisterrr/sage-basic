// FILE: src/discord/events/ready.ts
//--------------------------------------------------------------
import { Events, Client } from "discord.js";
import { logger } from "../../utils/logger.js";
import { initMemorySystem } from "../../memory/memorySystem.js";

export const readyEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client<true>) {  // ✅ Client<true> means ready
    logger.info(`✨ Online as ${client.user.tag}`);

    try {
      await initMemorySystem();
      logger.info("🧠 Memory system initialized.");
    } catch (err) {
      logger.error("Failed to initialize memory system:", err);
    }
  },
};