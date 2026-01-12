import fs from "fs";

export async function extractTextFromPDF(filePath) {
  //  dynamic import FIX for pdf-parse
  const pdfParse = (await import("pdf-parse")).default;

  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  return data.text;
}