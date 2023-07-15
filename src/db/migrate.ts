import { sql } from "@vercel/postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { env } from "../utils/env.js";

// inspired by Raphael Moreau @rphlmr for Postgres, extended for Planetscale
const runMigrate = async () => {
  if (!env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const db = drizzle(sql);

  console.log("⏳ Running migrations...");

  const start = Date.now();

  try {
    await migrate(db, { migrationsFolder: "src/db/migrations" });
  } catch (e) {
    console.log("error from migration", e);
    console.log("🥶 Trying again for coldstart");
    await migrate(db, { migrationsFolder: "src/db/migrations" });
  }

  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
