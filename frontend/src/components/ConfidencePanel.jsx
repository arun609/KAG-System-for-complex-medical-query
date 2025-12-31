export default function ConfidencePanel({ confidence, tier, explanation }) {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <p><strong>Confidence Score:</strong> {confidence}</p>
      <p><strong>Tier:</strong> {tier}</p>

      {explanation && (
        <div className="mt-2 text-sm text-gray-600">
          {explanation.map((line, i) => (
            <div key={i}>• {line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
