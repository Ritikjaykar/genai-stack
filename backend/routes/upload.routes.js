import express from "express";
import multer from "multer";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { pool } from "../db.js";
import { ensureCollection, addEmbedding } from "../services/chroma.service.js";
import { embedText } from "../services/embedding.service.js";

const router = express.Router();

/**
 * IMPORTANT:
 * Use memoryStorage for Railway / cloud
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    const { stackId } = req.body;

    if (!req.file || !stackId) {
      return res.status(400).json({
        error: "File or stackId missing"
      });
    }

    console.log("📄 PDF received:", req.file.originalname);
    console.log("🧩 Stack ID:", stackId);

    // 1️⃣ Extract text FROM BUFFER
    const text = await extractTextFromPDF(req.file.buffer);

    if (!text || text.trim().length === 0) {
      throw new Error("Extracted text is empty");
    }

    console.log("📝 Extracted text length:", text.length);

    // 2️⃣ Store in PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO documents (filename, content, stack_id)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [req.file.originalname, text, stackId]
    );

    const documentId = result.rows[0].id;

    console.log("🗄️ Document saved with ID:", documentId);

    // 3️⃣ ChromaDB (minimal, safe)
    await ensureCollection();

    const embedding = await embedText(text);

    await addEmbedding({
      id: documentId,
      embedding,
      document: text,
      metadata: {
        filename: req.file.originalname,
        stackId
      }
    });

    // 4️⃣ Respond
    res.json({ documentId });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      error: "PDF processing failed"
    });
  }
});

export default router;