// chat.routes.js
import express from "express";
import { pool } from "../db.js";
import { callLLM } from "../services/llm.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        error: "documentId or question missing"
      });
    }

    // ✅ Fetch EXACT document by ID
    const result = await pool.query(
      "SELECT content FROM documents WHERE id = $1",
      [documentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Document not found"
      });
    }

    const context = result.rows[0].content;

    const prompt = `
You are an assistant answering questions strictly based on the document below.

Document:
${context}

Question:
${question}

Answer clearly.
`;

    const answer = await callLLM(prompt);

    res.json({ answer });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      error: "Chat failed"
    });
  }
});

export default router;