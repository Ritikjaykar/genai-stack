//embedding.service.js
/**
 * Very simple deterministic embedding
 * (Assessment-safe, no external API)
 */
export function embedText(text) {
    const slice = text.slice(0, 256);
    return Array.from(slice).map(
      (char) => char.charCodeAt(0) / 255
    );
  }
  