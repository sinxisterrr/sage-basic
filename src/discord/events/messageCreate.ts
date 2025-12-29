// FILE: src/discord/events/messageCreate.ts
//--------------------------------------------------------------
import { Events, Message } from "discord.js";
import { logger } from "../../utils/logger.js";
import { handleMessage } from "../../core/handleMessage.js";

const warnedMissingContentGuilds = new Set<string>();

export const messageCreateEvent = {
  name: "messageCreate",  // ← Use raw string instead of Events.MessageCreate
  once: false,
  async execute(message: Message) {
    console.log("🚨🚨🚨 MESSAGE EVENT HIT 🚨🚨🚨", message.author.tag);
    try {
      // Stronger bot protection
      if (message.author.bot) {
        logger.debug(`Ignoring bot message from ${message.author.tag}`);
        return;
      }
      
      // Extra safety: ignore if it's the bot's own ID
      if (message.author.id === message.client.user?.id) {
        logger.debug(`Ignoring self-message`);
        return;
      }

      if (!message.content?.trim()) {
        const guildId = message.guild?.id;
        if (guildId && !warnedMissingContentGuilds.has(guildId)) {
          warnedMissingContentGuilds.add(guildId);
          logger.warn(
            "Message content is empty. Check Message Content Intent and channel permissions."
          );
          await message.reply(
            "I can see activity but not message content here. Please enable Message Content Intent in the Discord developer portal and ensure I have View Channel + Read Message History permissions."
          );
        }
      }

      logger.debug(`Processing message from ${message.author.tag}`);
      
      // handleMessage already sends the reply, so don't send it again here!
      await handleMessage(message);
      
      logger.debug(`Finished processing message from ${message.author.tag}`);
    } catch (err) {
      logger.error("❌ Failed to handle message:", err);
    }
  },
};
