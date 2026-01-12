//MyStacks.jsx
import { useState } from "react";
import CreateStackModal from "../components/CreateStackModal";
import Builder from "./Builder";

export default function MyStacks() {
  const [stacks, setStacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeStack, setActiveStack] = useState(null);

  if (activeStack) {
    return   <Builder
    stack={activeStack}
    onBack={() => setActiveStack(null)}
  />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-4 flex justify-between">
        <h1 className="text-xl font-semibold">GenAI Stack</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + New Stack
        </button>
      </header>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">My Stacks</h2>

        {stacks.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Create New Stack
              </h3>
              <p className="text-gray-500 mb-4">
                Start building your generative AI apps
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                + New Stack
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {stacks.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {s.description}
                </p>
                <button
                  onClick={() => setActiveStack(s)}
                  className="border px-4 py-2 rounded text-sm"
                >
                  Edit Stack ↗
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateStackModal
  onClose={() => setShowModal(false)}
  onCreate={(stack) => {
    setStacks([
      ...stacks,
      {
        id: crypto.randomUUID(), 
        ...stack
      }
    ]);
    setShowModal(false);
  }}
/>

      )}
    </div>
  );
}
