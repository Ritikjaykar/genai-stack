import express from "express";
import { pool } from "../db.js";
import { embedText } from "../services/embedding.service.js";
import { queryEmbedding } from "../services/chroma.service.js";
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

    // 1️. Embed the question
    const questionEmbedding = embedText(question);

    // 2️. Query Chroma for relevant chunks
    const contextChunks = await queryEmbedding(questionEmbedding);

    const context = contextChunks.join("\n\n");

    // 3️. Build final prompt
    const prompt = `
You are an assistant answering questions based ONLY on the provided document.

Document context:
${context}

User question:
${question}

Answer clearly and concisely.
`;

    // 4️. Call Groq LLM
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
