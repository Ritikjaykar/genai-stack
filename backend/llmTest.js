import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function testLLM() {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model:"llama-3.1-8b-instant",
      messages: [
        { role: "user", content: "Explain what a backend developer does in 2 lines." }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  console.log(response.data.choices[0].message.content);
}

testLLM();
