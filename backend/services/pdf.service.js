import fs from "fs";
import pdf from "pdf-parse";

/**
 * Extract text from uploaded PDF
 * @param {string} filePath - path from multer
 */
export async function extractTextFromPDF(filePath) {
  try {
    // 1️ Read file as BUFFER (CRITICAL)
    const dataBuffer = fs.readFileSync(filePath);

    // 2️ Pass buffer to pdf-parse
    const data = await pdf(dataBuffer);

    // 3️.Cleanup uploaded file (optional but good practice)
    fs.unlink(filePath, () => {});

    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("PDF extraction failed");
  }
}