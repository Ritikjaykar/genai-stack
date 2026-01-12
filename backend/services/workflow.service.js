import { pool } from "../db.js";
import { callLLM } from "./llm.service.js";

export async function runWorkflow(question) {
  const { rows } = await pool.query(
    "SELECT content FROM documents ORDER BY id DESC LIMIT 1"
  );

  const context = rows[0]?.content || "";

  const prompt = `
Answer using this document context:

${context}

Question:
${question}
`;

  const answer = await callLLM(prompt);

  await pool.query(
    "INSERT INTO chats (question, answer) VALUES ($1, $2)",
    [question, answer]
  );

  return answer;
}
