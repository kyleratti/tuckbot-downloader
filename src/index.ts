import dotenv from "dotenv";
import { logger } from "tuckbot-util";
import { Server } from "./server";

logger.info(`Starting up...`);

const result = dotenv.config();

if (result.error)
  logger.fatal({
    msg: `Unable to load environment variables`,
    obj: result.error,
  });
else logger.info(`Loaded environment variables`);

logger.info({
  msg: `Logging detail level set`,
  logLevel: logger.level,
});

logger.info(`Server started`);

const server = new Server();
server.start();
