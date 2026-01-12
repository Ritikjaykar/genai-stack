import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatModal from "../components/ChatModal";
import api from "../services/api";

export default function Builder({ stack, onBack }) {
  const [documents, setDocuments] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch documents ---------------- */

  useEffect(() => {
    if (stack?.id) {
      fetchDocuments();
    }
  }, [stack]);

  async function fetchDocuments() {
    try {
      const res = await api.get(`/documents/${stack.id}`);
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch documents failed", err);
      setDocuments([]);
    }
  }

  /* ---------------- Upload PDF ---------------- */

  async function handleUpload(file) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("stackId", stack.id);

    setLoading(true);

    try {
      const res = await api.post("/upload/pdf", formData);
      localStorage.setItem("documentId", res.data.documentId);
      fetchDocuments();
      alert("PDF uploaded successfully");
    } catch (err) {
      console.error("Upload failed", err);
      alert("PDF upload failed");
    }

    setLoading(false);
  }

  /* ---------------- Delete document ---------------- */

  async function deleteDocument(id) {
    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  if (!stack) {
    return <div className="p-10">No stack selected</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
        <h1 className="font-semibold">GenAI Stack</h1>

        <span className="text-sm text-gray-600">
          Stack: <b>{stack.name}</b>
        </span>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar onBack={onBack} />

        {/* Main content */}
        <div className="flex-1 p-10 bg-gray-50">
          {/* Upload box */}
          <label className="max-w-xl mx-auto flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 bg-white cursor-pointer">
            <span className="text-gray-700">
              {loading ? "Uploading..." : "Click or drag PDF to upload"}
            </span>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>

          {/* Document history */}
          <div className="max-w-xl mx-auto mt-8">
            <h3 className="font-semibold mb-3">Document History</h3>

            {documents.length === 0 && (
              <p className="text-gray-500 text-sm">
                No documents uploaded yet
              </p>
            )}

            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border rounded-lg p-4 mb-3 flex justify-between items-center"
              >
                <span className="font-medium">{doc.filename}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem("documentId", doc.id);
                      setShowChat(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Chat
                  </button>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="border px-3 py-1 rounded text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
    </div>
  );
}
