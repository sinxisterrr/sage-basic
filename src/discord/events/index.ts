// FILE: src/discord/events/index.ts
//--------------------------------------------------------------
import { Client, ClientEvents } from "discord.js";
import { logger } from "../../utils/logger.js";
import { readyEvent } from "./ready.js";
import { messageCreateEvent } from "./messageCreate.js";

type EventHandler = {
  name: keyof ClientEvents | string;
  once: boolean;
  execute: (...args: any[]) => void | Promise<void>;
};

export function registerEvents(client: Client) {
  const events: EventHandler[] = [readyEvent, messageCreateEvent];

  console.log("🔍 Loading events:");
  for (const evt of events) {
    console.log("  • Event name:", evt.name);
    console.log("    Type:", typeof evt.name);
    console.log("    Once:", evt.once);
    console.log("    Has execute:", typeof evt.execute === 'function');
  }

  // Add a catch-all listener to see what events ARE firing
  const allEvents = [
    'ready', 'messageCreate', 'messageUpdate', 'messageDelete',
    'guildCreate', 'guildMemberAdd', 'interactionCreate'
  ];
  
  console.log("\n🎯 Registering catch-all listeners for debugging:");
  for (const eventName of allEvents) {
    client.on(eventName as any, (...args) => {
      console.log(`🔔 RAW EVENT FIRED: ${eventName}`, 
        args.length > 0 ? `(${args.length} args)` : '');
    });
  }

  for (const evt of events) {
    const handler = (...args: any[]) => {
      console.log(`🔔 Handler executing for: ${evt.name}`);
      return evt.execute(...args);
    };
    
    if (evt.once) {
      client.once(evt.name, handler);
    } else {
      client.on(evt.name, handler);
    }
  }

  logger.info(`📡 Registered ${events.length} Discord event(s).`);
}