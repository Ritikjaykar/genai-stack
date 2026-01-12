import pdf from "pdf-parse";

/**
 * Accepts a BUFFER (not file path)
 */
export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    console.error("❌ PDF parse failed:", err);
    throw err;
  }
}