import React from "react";
import { motion } from "framer-motion";
import { GitPullRequest, ArrowDown } from "lucide-react";

export default function ReasoningPanel({ steps }) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-800 dark:text-yellow-200 rounded-xl backdrop-blur-sm">
        No reasoning steps available.
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 p-6 bg-medical-surface border border-purple-500/20 rounded-2xl backdrop-blur-md shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <GitPullRequest className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-medical-text">Reasoning Chain</h3>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-6 pb-6 border-l border-slate-700 last:border-0 last:pb-0">
            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-purple-900/40" />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-medical-surface/50 rounded-lg text-medical-text border border-slate-700/50 hover:border-purple-500/50 transition-colors"
            >
              <span className="text-xs text-purple-400 font-mono mb-1 block">STEP {idx + 1}</span>
              {step}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}