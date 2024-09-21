import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { StatusCodes } from "http-status-codes";

extendZodWithOpenApi(z);

const c = initContract();

const itemResponseSchema = z.object({
  id: z.string().openapi({
    description: "The id of this item.",
    example: "cjld2cyuq0006s1rr4xp6j8r0",
  }),
  description: z.string().openapi({
    description: "The description of the thing to be tallied.",
    example: `I can't test Polaris Tab components with testing-library`,
  }),
  createdAt: z.string().datetime().openapi({
    description: "The date and time this item was created, in ISO 8601 format.",
    example: "2024-07-06T12:00:00.000Z",
  }),
  updatedAt: z.string().datetime().openapi({
    description:
      "The date and time this item was last updated, in ISO 8601 format.",
    example: "2024-07-06T12:30:00.000Z",
  }),
  tally: z.number().gt(0).openapi({
    description: "The number of times this item has been tallied.",
    example: 1,
  }),
});

/**
 * To define response codes we're using the StatusCodes enum, but the values
 * have to be converted to numbers, so take special notice of the `+` in front
 * of each.
 */
export default c.router(
  {
    listItems: {
      method: "GET",
      path: "/items",
      responses: {
        [+StatusCodes.OK]: z.array(itemResponseSchema),
        [+StatusCodes.BAD_REQUEST]: z.object({
          error: z.literal("Bad Request"),
          description: z.literal("The request was malformed."),
        }),
      },
    },
    createItem: {
      method: "POST",
      path: "/items",
      body: z.object({
        description: z.string().openapi({
          description: "The thing you want to tally",
          example: `I can't test Polaris Tab components with testing-library`,
        }),
      }),
      responses: {
        [+StatusCodes.CREATED]: itemResponseSchema,
        [+StatusCodes.BAD_REQUEST]: z.object({
          error: z.literal("Bad Request"),
          description: z.literal("The request was malformed."),
        }),
      },
    },
  },
  {
    strictStatusCodes: true,
    commonResponses: {
      [+StatusCodes.NOT_FOUND]: z.object({
        error: z.literal("Not Found"),
        description: z.literal("The specified resource was not found."),
      }),
      [+StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
        error: z.literal("Internal Server Error"),
        description: z.literal("An internal server error occurred."),
      }),
    },
  },
);
