import type { Config } from "drizzle-kit";

import { env } from "./src/lib/env";

export default {
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
} satisfies Config;
