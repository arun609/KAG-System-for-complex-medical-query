import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import QueryBox from "./QueryBox";
import AnswerPanel from "./AnswerPanel";
import ConfidencePanel from "./ConfidencePanel";
import ReasoningPanel from "./ReasoningPanel";
import ResultTabs from "./ResultTabs";

export default function QueryPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [tier, setTier] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [reasoning, setReasoning] = useState([]);
  const [triples, setTriples] = useState([]);
  const [tab, setTab] = useState("Answer");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuery = async (q) => {
    setQuery(q);
    setIsLoading(true);
    setError(null);
    setAnswer("");
    setConfidence(null);
    setTier(null);
    setExplanation(null);
    setReasoning([]);
    setTriples([]);

    // Reset tabs to answer view
    setTab("Answer");

    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, user_id: user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from server");
      }

      const data = await response.json();
      console.log("API Response:", data);

      setAnswer(data.final_answer || "No answer found.");
      setConfidence(data.confidence_score);
      setTier(data.confidence_tier);
      setExplanation(data.explanation);
      setReasoning(data.reasoning_steps || []);
      setTriples(data.structured_triples || []);

    } catch (err) {
      console.error(err);
      setError("An error occurred. check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto w-full relative z-10">
      <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-medical-primary to-medical-accent mb-8 drop-shadow-sm">
        Medical Query Interface
      </h2>
      <QueryBox onSubmit={handleQuery} isLoading={isLoading} />
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
          {error}
        </div>
      )}
      <div className="mt-8">
        {answer && <ResultTabs active={tab} setActive={setTab} />}

        <div className="mt-6">
          {tab === "Answer" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AnswerPanel answer={answer} isLoading={isLoading} />
              <ConfidencePanel confidence={confidence} tier={tier} explanation={explanation ? [explanation] : []} />
            </div>
          )}

          {tab === "KG Entities" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-medical-accent" />
                Extracted Medical Entities
              </h3>
              <div className="flex flex-wrap gap-2">
                {triples.flatMap(r => [r[0], r[2]]).filter((v, i, a) => a.indexOf(v) === i).map((entity, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">
                    {entity}
                  </span>
                ))}
                {triples.length === 0 && <p className="text-slate-500">No entities extracted.</p>}
              </div>
            </div>
          )}

          {tab === "Knowledge Evidence" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              {triples.map((step, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                  <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-xs font-mono rounded text-slate-500">
                    {i + 1}
                  </div>
                  <div className="font-mono text-sm">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{step[0]}</span>
                    <span className="mx-2 text-slate-400">→</span>
                    <span className="text-slate-500 italic">{step[1]}</span>
                    <span className="mx-2 text-slate-400">→</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">{step[2]}</span>
                  </div>
                </div>
              ))}
              {triples.length === 0 && <p className="text-slate-500">No evidence found.</p>}
            </div>
          )}

          {tab === "Explainable Reasoning" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <ReasoningPanel steps={reasoning} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}