import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: process.env.POSTGRES_SSL != "false",
});
export const db = drizzle(client, { logger: false });
