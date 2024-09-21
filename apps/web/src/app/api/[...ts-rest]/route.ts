import { createNextHandler } from "@ts-rest/serverless/next";
import contract from "@tally/contract";
import { StatusCodes } from "http-status-codes";

const handler = createNextHandler(
  contract,
  {
    listItems: async () => {
      return {
        status: StatusCodes.OK,
        body: [
          {
            id: "",
            description: "",
            createdAt: "",
            updatedAt: "",
            tally: 1,
          },
        ],
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
