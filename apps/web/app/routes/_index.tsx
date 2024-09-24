import { json, type MetaFunction } from "@remix-run/node";
import db from "~/db";
import { items } from "~/db/schema/items";
import { count, desc, eq } from "drizzle-orm";
import { tallies } from "~/db/schema/tallies";
import {useLoaderData} from "@remix-run/react";

// noinspection JSUnusedGlobalSymbols
export const meta: MetaFunction = () => {
  return [{ title: "Tally" }];
};

export async function loader() {
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

  return json(
    allItems.map((i) => ({
      id: i.id,
      description: i.description,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
      tally: i.tally,
    })),
  );
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Hello World
      </h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.description} - {item.tally} - {item.createdAt}
          </li>
        ))}
      </ul>
    </main>
  );
}
