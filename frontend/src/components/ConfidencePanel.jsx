import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ConfidencePanel({ confidence, tier, explanation }) {
  const getColors = (score) => {
    if (tier === 'High') return 'text-green-400 border-green-400/30 bg-green-400/10';
    if (tier === 'Medium') return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  };

  const themeClass = getColors(confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 bg-medical-surface border border-slate-700/50 rounded-2xl backdrop-blur-md shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-6 h-6 text-medical-accent" />
        <h3 className="text-xl font-bold text-medical-text">Confidence Analysis</h3>
      </div>

      <div className={`flex items-center justify-between p-4 rounded-xl border ${themeClass} mb-4`}>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider opacity-70">Confidence Score</span>
          <span className="text-2xl font-bold">{confidence ? `${Math.round(confidence * 100)}%` : '0%'}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-wider opacity-70">Tier</span>
          <span className="text-xl font-bold">{tier || 'N/A'}</span>
        </div>
      </div>

      {explanation && (
        <div className="mt-4 space-y-2">
          {explanation.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="flex items-start gap-2 text-medical-muted text-sm"
            >
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-medical-500 shrink-0" />
              {line}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
