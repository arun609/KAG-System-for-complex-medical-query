export default function QueryBox({ query, setQuery, onSubmit, loading }) {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., Which drug is indicated for ST-elevation myocardial infarction?"
        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={onSubmit}
        disabled={loading}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}
