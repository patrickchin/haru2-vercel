import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(`${process.env.POSTGRES_URL!}`);
export const db = drizzle(client, { logger: false });
