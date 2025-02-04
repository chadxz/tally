import winston from "winston";
import config from "./config";
import packageJson from "../package.json";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: packageJson.name },
  transports: [
    new winston.transports.Console({
      silent: config.nodeEnv === "test",
      format:
        config.nodeEnv === "production"
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
              winston.format.errors({ stack: true }),
            ),
    }),
  ],
});

export default logger;
