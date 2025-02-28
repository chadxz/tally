import winston from "winston";
import config from "./config";
import packageJson from "../package.json";

export default winston.createLogger({
  level: "info",
  defaultMeta: {
    service_name: packageJson.name,
    service_version: config.commitRef,
    environment: config.nodeEnv,
  },
  transports: buildTransports(),
});

function buildTransports(): winston.transport[] {
  const rawFormat = winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
  );

  const prettyFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.errors({ stack: true }),
  );

  const transports: winston.transport[] = [
    new winston.transports.Console({
      silent: config.nodeEnv === "test",
      format: config.nodeEnv === "production" ? rawFormat : prettyFormat,
    }),
  ];

  if (config.highlightProjectId) {
    transports.push(
      new winston.transports.Http({
        host: "pub.highlight.run",
        path: "/v1/logs/json",
        ssl: true,
        headers: {
          "x-highlight-project": config.highlightProjectId,
          "x-highlight-service": packageJson.name,
        },
        format: rawFormat,
      }),
    );
  }

  return transports;
}
