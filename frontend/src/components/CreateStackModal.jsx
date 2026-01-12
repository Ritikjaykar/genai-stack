import { useState } from "react";

export default function CreateStackModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-xl p-6">
        <h2 className="font-semibold mb-4">Create New Stack</h2>

        <label className="text-sm">Name</label>
        <input
          className="w-full border p-2 rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-sm">Description</label>
        <textarea
          className="w-full border p-2 rounded mb-4"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={!name}
            onClick={() => onCreate({ name, description: desc })}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
