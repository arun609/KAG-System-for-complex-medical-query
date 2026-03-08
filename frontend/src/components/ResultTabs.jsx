import { motion } from "framer-motion";

export default function ResultTabs({ active, setActive }) {
  const tabs = ["Answer", "KG Entities", "Knowledge Evidence", "Explainable Reasoning"];

  return (
    <div className="flex p-1 gap-2 bg-medical-surface/80 backdrop-blur-md rounded-xl w-fit border border-medical-primary/20 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className="relative px-6 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-colors z-10"
        >
          {active === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-medical-primary rounded-lg z-[-1] shadow-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className={active === tab ? "text-white" : "text-medical-muted hover:text-medical-primary"}>
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
}
