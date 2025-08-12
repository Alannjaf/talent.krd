import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Non-fatal: allow app to run without DB in dev, but warn in console
  // eslint-disable-next-line no-console
  console.warn("DATABASE_URL is not set. Database features will be disabled.");
}

export const sql = connectionString ? neon(connectionString) : (async () => {
  throw new Error("DATABASE_URL is not configured");
}) as unknown as ReturnType<typeof neon>;
