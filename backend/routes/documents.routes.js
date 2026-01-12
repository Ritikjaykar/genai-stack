//documents.routes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * Get documents for a specific stack
 */
router.get("/:stackId", async (req, res) => {
  try {
    const { stackId } = req.params;

    const result = await pool.query(
      `
      SELECT id, filename
      FROM documents
      WHERE stack_id = $1
      ORDER BY id DESC
      `,
      [stackId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

/**
 * Delete a document
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM documents WHERE id = $1",
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

export default router;
