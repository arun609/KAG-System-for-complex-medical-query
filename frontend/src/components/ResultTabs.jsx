export default function ResultTabs({ active, setActive }) {
  const tabs = ["ANSWER", "REASONING", "CONFIDENCE"];

  return (
    <div className="flex gap-2 mt-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-2 rounded ${
            active === tab
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
