//Sidebar.jsx
import { ArrowLeft } from "lucide-react";

export default function Sidebar({ onBack }) {
  return (
    <div className="w-64 border-r bg-white p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={onBack}
          className="p-1 rounded hover:bg-gray-100"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>

        <h3 className="font-semibold">Components</h3>
      </div>

      {/* Components list (static, visual only) */}
      <div className="space-y-4 text-gray-700">
        <div className="border rounded-md px-4 py-3">Input</div>
        <div className="border rounded-md px-4 py-3">LLM</div>
        <div className="border rounded-md px-4 py-3">Knowledge Base</div>
        <div className="border rounded-md px-4 py-3">Output</div>
      </div>
    </div>
  );
}
