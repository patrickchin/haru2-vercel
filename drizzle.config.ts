import type { Config } from "drizzle-kit";

// needed for drizzle studio
require("dotenv").config({ path: [".env.production.local"] });
console.log("Using SSL", process.env.POSTGRES_SSL, process.env.POSTGRES_SSL != "false");

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // dbCredentials : { url: `${process.env.POSTGRES_URL}?sslmode=require` },
  // dbCredentials : { url: process.env.POSTGRES_URL || "" },
  dbCredentials: {
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    host: process.env.POSTGRES_HOST!,
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    database: process.env.POSTGRES_DATABASE!,
    ssl: process.env.POSTGRES_SSL != "false",
  },
} satisfies Config;
