import express from "express";
import multer from "multer";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { pool } from "../db.js";

// 🔹 Use memory storage (IMPORTANT)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();

router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    const { stackId } = req.body;

    console.log("📄 File:", req.file?.originalname);
    console.log("🧩 Stack ID:", stackId);

    if (!req.file || !stackId) {
      return res.status(400).json({
        error: "File or stackId missing"
      });
    }

    // 1️⃣ Extract text from buffer
    const text = await extractTextFromPDF(req.file.buffer);

    // 2️⃣ Save to DB
    const result = await pool.query(
      `
      INSERT INTO documents (filename, content, stack_id)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [req.file.originalname, text, stackId]
    );

    const documentId = result.rows[0].id;

    console.log("✅ Document saved:", documentId);

    // 3️⃣ Respond
    res.json({ documentId });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      error: "PDF processing failed"
    });
  }
});

export default router;