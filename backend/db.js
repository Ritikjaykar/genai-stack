import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

/**
 * Railway provides DATABASE_URL automatically
 * Local/dev can still use individual vars
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

// Test connection once at startup
pool.query("SELECT 1")
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB error", err));

export { pool };
