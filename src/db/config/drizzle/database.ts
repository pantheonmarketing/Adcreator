import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import * as relations from "./relations";

const connectionString = process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

export const client = new pg.Pool({
  connectionString: connectionString,
  ssl: process.env.DB_SSL === "true" ? true : false,
  max: 20,
});

// { schema } is used for relational queries
export const drizzleDb = drizzle(client, {
  schema: { ...schema, ...relations },
  // logger:
  //   process.env.NODE_ENV !== "test"
  //     ? undefined
  //     : {
  //         logQuery: (message: string) => {
  //           console.log("drizzle query:", message.substring(0, 30) + "...");
  //         },
  //       },
});
