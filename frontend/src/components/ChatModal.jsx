import { useState } from "react";

export default function ChatModal({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const documentId = localStorage.getItem("documentId");

    setMessages((m) => [...m, { role: "user", text: input }]);
    setLoading(true);

    const res = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId,
        question: input
      })
    });

    const data = await res.json();

    setMessages((m) => [...m, { role: "ai", text: data.answer }]);
    setInput("");
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[600px] h-[500px] rounded-lg flex flex-col">
        <div className="p-4 border-b flex justify-between">
          <b>Chat with PDF</b>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div key={i}>
              <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
            </div>
          ))}
          {loading && <p className="text-gray-400">Thinking...</p>}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
