import { createNextHandler } from "@ts-rest/serverless/next";
import contract from "@tally/contract";
import { StatusCodes } from "http-status-codes";
import db from "@/db";
import { count, desc, eq } from "drizzle-orm";
import { items } from "@/db/schema/items";
import { tallies } from "@/db/schema/tallies";

const handler = createNextHandler(
  contract,
  {
    listItems: async () => {
      const allItems = await db
        .select({
          id: items.id,
          description: items.description,
          createdAt: items.createdAt,
          updatedAt: items.updatedAt,
          tally: count(tallies.id),
        })
        .from(items)
        .innerJoin(tallies, eq(items.id, tallies.itemId))
        .groupBy(items.id)
        .orderBy(desc(items.createdAt));

      return {
        status: StatusCodes.OK,
        body: allItems.map((i) => ({
          id: i.id,
          description: i.description,
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
          tally: i.tally,
        })),
      };
    },
    createItem: async () => {
      return {
        status: StatusCodes.CREATED,
        body: {
          id: "",
          description: "",
          createdAt: "",
          updatedAt: "",
          tally: 1,
        },
      };
    },
  },
  {
    basePath: "/api",
    cors: {
      origin: true,
    },
    jsonQuery: true,
    responseValidation: false,
    handlerType: "app-router",
  },
);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
