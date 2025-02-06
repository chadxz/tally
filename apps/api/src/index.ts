import { highlightMiddleware } from "@highlight-run/hono";
import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { oneLine, stripIndent } from "common-tags";
import logger from "./logger";
import config from "./config";
import packageJson from "../package.json";

const querySchema = z.object({
  cursor: z
    .string()
    .optional()
    .openapi({
      param: {
        name: "cursor",
        in: "query",
      },
      description: oneLine`
        The cursor to start from. If not provided, the first page will be
        returned.
      `,
    }),
  limit: z
    .number({ coerce: true })
    .gt(0)
    .optional()
    .default(100)
    .openapi({
      param: {
        name: "limit",
        in: "query",
      },
      description: oneLine`
        The maximum number of items to return. Determines page size when
        paginating the response using \`cursor\`.
      `,
    }),
});

const itemSchema = z
  .object({
    id: z.string().openapi({
      description: "The unique identifier for the item.",
      example: "cjld2cyuq0006s1rr4xp6j8r0",
    }),
    description: z.string().openapi({
      description: "The description of the thing to be tallied.",
      example: "I can't test Polaris Tab components with testing-library",
    }),
    createdAt: z.string().openapi({
      description:
        "The date and time this item was created, in ISO 8601 format.",
      format: "date-time",
      example: "2024-07-06T12:00:00.000Z",
    }),
    updatedAt: z.string().openapi({
      description:
        "The date and time this item was last updated, in ISO 8601 format.",
      format: "date-time",
      example: "2024-07-06T12:30:00.000Z",
    }),
    tally: z.number().gte(1).openapi({
      description: "The number of times this item has been tallied.",
      example: 3,
    }),
  })
  .openapi("Item");

const itemsSchema = z.array(itemSchema);

const route = createRoute({
  method: "get",
  path: "/items",
  tags: ["Items"],
  summary: "List Items",
  description: "List the items you have tallies for.",
  request: {
    query: querySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: itemsSchema,
        },
      },
      description: "Retrieve the user",
    },
  },
  security: [{ bearerAuth: [] }],
});

const app = new OpenAPIHono();

if (config.highlightProjectId) {
  logger.info("Enabling Highlight.io telemetry");
  app.use(
    highlightMiddleware({
      projectID: config.highlightProjectId,
      serviceName: packageJson.name,
      environment: config.nodeEnv,
      serviceVersion: config.commitRef,
    }),
  );
}

app.openAPIRegistry.register("Item", itemSchema);

app.openapi(route, async (c) => {
  const { limit, cursor } = c.req.query();
  logger.info("Environment", { environment: process.env })
  return c.json([], 200);
});

app.get("/foo", (c) => {
  return c.json({ foo: "bar" });
});

app.get("/error", () => {
  throw new Error("This is a test error. Nothing to see here.");
});

app.notFound((c) => {
  return c.json({ message: "Not found" }, { status: 404 });
});

app.onError((error, c) => {
  logger.error("Unhandled error", { error });
  const message = "Internal server error";
  return c.json({ message }, { status: 500 });
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

app.doc31("/openapi.json", (c) => ({
  openapi: "3.1.0",
  info: {
    title: "Tally API",
    version: "1.0.0",
    description: stripIndent`
      Tally helps you collect ideas, count how many times they come up, then
      use this data to make decisions. The Tally API gives you access to
      operate on your tallies and related operational data.

      ## Authentication
      All requests to the Tally API must be authenticated using a Bearer
      token. You can obtain a token by signing up for a free account at
      https://tally.bot.

      ## Credits
      Made with ☕️ by [Chad McElligott](https://chadxz.dev).
    `,
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Current environment",
    },
  ],
}));

app.get(
  "/",
  apiReference({
    pageTitle: "Tally API",
    spec: {
      url: "/openapi.json",
    },
    favicon: "/favicon.ico",
  }),
);

export default app;
