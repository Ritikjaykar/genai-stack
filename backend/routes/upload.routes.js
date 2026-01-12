import express from "express";
import multer from "multer";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { pool } from "../db.js";
import { ensureCollection, addEmbedding } from "../services/chroma.service.js";
import { embedText } from "../services/embedding.service.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    const { stackId } = req.body;

    if (!req.file || !stackId) {
      return res.status(400).json({
        error: "File or stackId missing"
      });
    }

    // 1️. Extract text
    const text = await extractTextFromPDF(req.file.path);

    // 2️. Store in PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO documents (filename, content, stack_id)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [req.file.originalname, text, stackId]
    );

    const documentId = result.rows[0].id;

    // 3️. Store embedding in Chroma (MINIMAL usage)
    await ensureCollection();

    const embedding = embedText(text);

    await addEmbedding({
      id: documentId,
      embedding,
      document: text,
      metadata: {
        filename: req.file.originalname,
        stackId
      }
    });

    // 4️. Respond
    res.json({ documentId });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      error: "PDF processing failed"
    });
  }
});

export default router;
