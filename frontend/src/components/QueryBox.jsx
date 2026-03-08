import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function QueryBox({ onSubmit, isLoading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onSubmit(query);
    }
  };

  return (
    <div className="flex gap-4 relative">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-medical-primary" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a complex medical question (e.g., drug interactions, gene associations)..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-primary focus:border-transparent text-slate-900 placeholder-slate-500 shadow-inner transition-all"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={isLoading || !query.trim()}
        className="px-8 py-4 bg-gradient-to-r from-medical-primary to-medical-accent text-white font-bold rounded-xl shadow-lg hover:shadow-medical-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          "Analyze"
        )}
      </motion.button>
    </div>
  );
}
