import { config } from "dotenv";
import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Prefer .env.local if present, else .env
const envPath = existsSync(".env.local") ? ".env.local" : ".env";
config({ path: envPath });

export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});


