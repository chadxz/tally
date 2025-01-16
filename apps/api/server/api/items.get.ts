import { z } from "zod";
import { oneLine } from "common-tags";

const paramsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().default(100),
});

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, paramsSchema.parse);
  return [];
});

defineRouteMeta({
  openAPI: {
    tags: ["Items"],
    summary: "List Items",
    description: "Lists the items you have tallies for.",
    parameters: [
      {
        in: "query",
        name: "cursor",
        description: "The pagination cursor to start from. When omitted, starts from the beginning.",
        schema: {
          type: "string",
        },
      },
      {
        in: "query",
        name: "limit",
        description: "The maximum number of items to return. Determines page size when paginating the response using `cursor`.",
        schema: {
          type: "number",
          default: 100,
        },
      },
    ],
    security: [
      {
        "Bearer Token": [],
      },
    ],
    responses: {
      "200": {
        description:
          "The list of items you have tallies for, or an empty list if you haven't gotten started yet.",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: oneLine`
                      The unique identifier for the item.
                    `,
                    example: "cjld2cyuq0006s1rr4xp6j8r0",
                  },
                  description: {
                    type: "string",
                    description: "The description of the thing to be tallied.",
                    example:
                      "I can't test Polaris Tab components with testing-library",
                  },
                  createdAt: {
                    type: "string",
                    description:
                      "The date and time this item was created, in ISO 8601 format.",
                    example: "2024-07-06T12:00:00.000Z",
                    format: "date-time",
                  },
                  updatedAt: {
                    type: "string",
                    description:
                      "The date and time this item was last updated, in ISO 8601 format.",
                    example: "2024-07-06T12:30:00.000Z",
                    format: "date-time",
                  },
                  tally: {
                    type: "number",
                    description:
                      "The number of times this item has been tallied.",
                    example: 3,
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
