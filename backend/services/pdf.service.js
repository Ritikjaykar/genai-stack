import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractTextFromPDF(filePath) {
  try {
    // Read PDF as buffer
    const buffer = fs.readFileSync(filePath);

    // Parse PDF
    const data = await pdfParse(buffer);

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    return data.text;
  } catch (err) {
    console.error("❌ PDF parse failed:", err);
    throw new Error("PDF processing failed");
  }
}