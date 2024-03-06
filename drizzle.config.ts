import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: `${process.env.POSTGRES_URL}?sslmode=require`,
    // user: process.env.POSTGRES_USER,
    // password: process.env.POSTGRES_PASSWORD,
    // host: process.env.POSTGRES_HOST!,
    // port: 5432,
    // database: process.env.POSTGRES_DATABASE!,
  }
} satisfies Config;