import ecsFormat from "@elastic/ecs-pino-format";
import pino from "pino";
import pinoElastic from "pino-elasticsearch";
import { multistream } from "pino-multi-stream";
import { configurator } from "tuckbot-util";

const streamToElastic = pinoElastic({
  index: configurator.logger.elasticSearch.index,
  consistency: "one",
  node: configurator.logger.elasticSearch.node,
  "es-version": 7,
  "flush-bytes": 10,
  // sync: true,
});

export const logger = pino(
  { level: configurator.logger.level, ...ecsFormat },
  multistream([{ stream: process.stdout }, { stream: streamToElastic }])
);
