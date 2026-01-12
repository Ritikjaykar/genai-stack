import express from "express";
import multer from "multer";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { pool } from "../db.js";

// ❌ DO NOT import chroma in production
// import { ensureCollection, addEmbedding } from "../services/chroma.service.js";
// import { embedText } from "../services/embedding.service.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    const { stackId } = req.body;

    // 1️⃣ Validate input
    if (!req.file) {
      return res.status(400).json({ error: "File missing" });
    }

    if (!stackId) {
      return res.status(400).json({ error: "stackId missing" });
    }

    // 2️⃣ Validate UUID format (VERY IMPORTANT)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(stackId)) {
      return res.status(400).json({
        error: "Invalid stackId (must be UUID)"
      });
    }

    // 3️⃣ Extract text
    const text = await extractTextFromPDF(req.file.path);

    // 4️⃣ Store in PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO documents (filename, content, stack_id)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [req.file.originalname, text, stackId]
    );

    const documentId = result.rows[0].id;

    // 5️⃣ (OPTIONAL) ChromaDB — disabled on Railway
    /*
    if (process.env.ENABLE_CHROMA === "true") {
      await ensureCollection("documents");
      const embedding = embedText(text);

      await addEmbedding({
        collection: "documents",
        id: documentId,
        embedding,
        document: text,
        metadata: { filename: req.file.originalname, stackId }
      });
    }
    */

    // 6️⃣ Respond success
    res.json({
      success: true,
      documentId
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      error: "PDF processing failed"
    });
  }
});

export default router;