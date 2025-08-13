import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Non-fatal: allow app to run without DB in dev, but warn in console
  console.warn("DATABASE_URL is not set. Database features will be disabled.");
}

export const sql = connectionString
  ? neon(connectionString)
  : ((async () => {
      throw new Error("DATABASE_URL is not configured");
    }) as unknown as ReturnType<typeof neon>);

export const db = connectionString ? drizzle(neon(connectionString)) : undefined as unknown as ReturnType<typeof drizzle>;
