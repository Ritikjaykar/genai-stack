import ComponentNode from "./ComponentNode";

export default function Canvas({ nodes, onPDFReady }) {
  return (
    <div className="flex-1 relative bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:20px_20px]">
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Use the left panel to add components
        </div>
      )}

      {nodes.map((n, i) => (
        <ComponentNode
          key={n.id}
          type={n.type}
          position={{ x: 80, y: 80 + i * 120 }}
          onPDFReady={onPDFReady}   
        />
      ))}
    </div>
  );
}
