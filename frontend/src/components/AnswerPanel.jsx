import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnswerPanel({ answer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-medical-surface border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-md shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-medical-primary/10 rounded-lg">
          <Bot className="w-6 h-6 text-medical-primary" />
        </div>
        <h3 className="text-xl font-bold text-medical-text">AI Analysis</h3>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none text-medical-text leading-relaxed">
        {answer || <span className="text-medical-muted italic">Waiting for query...</span>}
      </div>
    </motion.div>
  );
}