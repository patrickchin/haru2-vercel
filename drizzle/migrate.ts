import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

require("dotenv").config({ path: [".env.local"] });

if (!process.env.POSTGRES_URL) {
  console.log("no postgres url");
  process.exit();
}

const migrationClient = postgres(process.env.POSTGRES_URL, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
