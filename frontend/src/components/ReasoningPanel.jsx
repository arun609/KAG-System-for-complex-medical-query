export default function ReasoningPanel({ steps }) {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Reasoning Steps</h3>
      <ol className="list-decimal pl-5 space-y-1">
        {steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
}