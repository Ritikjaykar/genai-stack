import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Configure PDF.js for Node.js environment
// This prevents warnings about missing DOM APIs
if (typeof window === 'undefined') {
  const { GlobalWorkerOptions } = pdfjsLib;
  // Disable worker in Node.js environment
  GlobalWorkerOptions.workerSrc = '';
}

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromPDF(filePath) {
  try {
    // Read the PDF file as a buffer
    const buffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(buffer);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      verbosity: 0, // Suppress console warnings
    });
    
    const pdfDocument = await loadingTask.promise;
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    // Clean up the document
    await pdfDocument.destroy();
    
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extract text from a PDF buffer (useful for uploaded files)
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromPDFBuffer(buffer) {
  try {
    const uint8Array = new Uint8Array(buffer);
    
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      verbosity: 0,
    });
    
    const pdfDocument = await loadingTask.promise;
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    await pdfDocument.destroy();
    
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF buffer:", error);
    throw new Error(`Failed to extract text from PDF buffer: ${error.message}`);
  }
}

/**
 * Get PDF metadata and page count
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} PDF metadata
 */
export async function getPDFInfo(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(buffer);
    
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      verbosity: 0,
    });
    
    const pdfDocument = await loadingTask.promise;
    const metadata = await pdfDocument.getMetadata();
    
    const info = {
      numPages: pdfDocument.numPages,
      title: metadata.info?.Title || null,
      author: metadata.info?.Author || null,
      subject: metadata.info?.Subject || null,
      creator: metadata.info?.Creator || null,
      producer: metadata.info?.Producer || null,
      creationDate: metadata.info?.CreationDate || null,
    };
    
    await pdfDocument.destroy();
    
    return info;
  } catch (error) {
    console.error("Error getting PDF info:", error);
    throw new Error(`Failed to get PDF info: ${error.message}`);
  }
}