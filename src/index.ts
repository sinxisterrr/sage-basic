import { DiscClient } from "./client/DiscClient.js";
import { logger } from "./utils/logger.js";

async function main() {
  logger.info("🚀 Starting…");
  const client = new DiscClient();

  await client.start();
}


main().catch((err) => {
  logger.error("🔥 Fatal startup error:", err);
  process.exit(1);
});
