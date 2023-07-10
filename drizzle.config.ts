import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL || "",
  },
} satisfies Config;
