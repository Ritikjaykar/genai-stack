import axios from "axios";

/**
 * IMPORTANT:
 * Inside docker-compose network:
 * chromadb service runs on port 8000
 */
const CHROMA_BASE_URL = "http://chromadb:8000/api/v2";
const COLLECTION_NAME = "documents";

/**
 * Ensure collection exists (safe to call multiple times)
 */
export async function ensureCollection() {
  try {
    await axios.post(`${CHROMA_BASE_URL}/collections`, {
      name: COLLECTION_NAME
    });
  } catch (err) {
    // Collection already exists → ignore
  }
}

/**
 * Add document embedding
 */
export async function addEmbedding({
  id,
  embedding,
  document,
  metadata
}) {
  await axios.post(
    `${CHROMA_BASE_URL}/collections/${COLLECTION_NAME}/add`,
    {
      ids: [id],
      embeddings: [embedding],
      documents: [document],
      metadatas: [metadata]
    }
  );
}

/**
 * Query related chunks
 */
export async function queryEmbedding(embedding) {
  const res = await axios.post(
    `${CHROMA_BASE_URL}/collections/${COLLECTION_NAME}/query`,
    {
      query_embeddings: [embedding],
      n_results: 3
    }
  );

  return res.data.documents?.[0] || [];
}
