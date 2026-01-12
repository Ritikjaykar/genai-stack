import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPDF(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    // remove temp upload
    fs.unlinkSync(filePath);

    return data.text;
  } catch (err) {
    console.error("❌ PDF parse failed:", err);
    throw err;
  }
}