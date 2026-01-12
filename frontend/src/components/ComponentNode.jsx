//ComponentNode.jsx
import { Settings, Upload } from "lucide-react";
import api from "../services/api";

export default function ComponentNode({ type, position, onPDFReady }) {
  const configs = {
    input: {
      label: "Input",
      color: "text-blue-500",
      description: "User query entry point"
    },
    llm: {
      label: "LLM",
      color: "text-purple-500",
      description: "Generate response using LLM"
    },
    knowledge: {
      label: "Knowledge Base",
      color: "text-green-500",
      description: "Upload documents for context"
    },
    output: {
      label: "Output",
      color: "text-red-500",
      description: "Final response output"
    }
  };

  const config = configs[type];
  if (!config) return null;

  async function handlePDFUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await api.post("/upload/pdf", formData);
      localStorage.setItem("documentId", res.data.documentId);
  
      if (onPDFReady) onPDFReady();
  
      alert("PDF uploaded successfully");
    } catch (err) {
      alert("PDF upload failed");
    }
  }
  

  return (
    <div
      className="absolute bg-white rounded-xl shadow-md border min-w-[220px] p-4"
      style={{
        left: position?.x ?? 80,
        top: position?.y ?? 80
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className={`font-semibold ${config.color}`}>
          {config.label}
        </span>
        <Settings className="w-4 h-4 text-gray-400" />
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3">
        {config.description}
      </p>

      {/* Knowledge Base Upload */}
      {type === "knowledge" && (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            Click to upload PDF
          </span>

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePDFUpload(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
