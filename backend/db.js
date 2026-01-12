import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool
  .connect()
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.error("❌ DB error", err));