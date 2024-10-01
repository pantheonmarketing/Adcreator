import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./src/db/config/drizzle/migrations/",
  schema: "./src/db/config/drizzle/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // host: process.env.DB_HOST!,
    // port: Number(process.env.DB_PORT!),
    // user: process.env.DB_USERNAME!,
    // password: process.env.DB_PASSWORD!,
    // database: process.env.DB_NAME!,
    ssl: process.env.DB_SSL === "true" ? true : false,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
