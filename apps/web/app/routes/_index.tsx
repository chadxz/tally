import { type MetaFunction } from "react-router";
import db from "~/db";
import { items } from "~/db/schema/items";
import { count, desc, eq, max } from "drizzle-orm";
import { tallies } from "~/db/schema/tallies";
import { useLoaderData } from "react-router";
import { Card, Table } from "react-daisyui";

// noinspection JSUnusedGlobalSymbols
export const meta: MetaFunction = () => {
  return [{ title: "Tally" }];
};

export async function loader() {
  const allItems = await db
    .select({
      id: items.id,
      description: items.description,
      tally: count(tallies.id),
      lastTalliedAt: max(tallies.createdAt),
    })
    .from(items)
    .innerJoin(tallies, eq(items.id, tallies.itemId))
    .groupBy(items.id)
    .orderBy(desc(items.createdAt));

  return allItems.map((i) => ({
    id: i.id,
    description: i.description,
    tally: i.tally,
    lastTalliedAt: i.lastTalliedAt,
  }));
}

// noinspection JSUnusedGlobalSymbols
export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className={"container mx-auto py-4"}>
      <h1 className={"text-4xl font-extrabold"}>Hello World</h1>
      <Table>
        <Table.Head>
          <span>Description</span>
          <span>Tally</span>
          <span>Last Updated</span>
        </Table.Head>
        <Table.Body>
          {data.map((item) => (
            <Table.Row key={item.id}>
              <span>{item.description}</span>
              <span>{item.tally}</span>
              <span>{item.lastTalliedAt?.toISOString()}</span>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
