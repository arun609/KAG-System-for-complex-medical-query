export default function AnswerPanel({ answer }) {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Answer</h3>
      <p>{answer}</p>
    </div>
  );
}