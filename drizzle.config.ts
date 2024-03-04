import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();
 
export default {
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    // connectionString: process.env.POSTGRES_URL_NON_POOLING || "",
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST!,
    port: 5432,
    database: process.env.POSTGRES_DATABASE!,
  }
} satisfies Config;