import React from 'react';
import { motion } from 'framer-motion';

export default function ActivityGraph() {
    // Mock data points
    const points = [10, 25, 18, 40, 35, 60, 55, 80, 70, 95];

    const width = 100;
    const height = 50;
    const dataMax = Math.max(...points);

    // Create SVG path
    const pathData = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - (p / dataMax) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">System Activity</h3>
                <p className="text-sm text-slate-500">Query volume over last 24h</p>
            </div>

            <div className="flex-1 flex items-end justify-center w-full relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--medical-primary)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--medical-primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area Fill */}
                    <motion.path
                        d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
                        fill="url(#gradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Line Path */}
                    <motion.path
                        d={pathData}
                        fill="none"
                        stroke="var(--medical-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </svg>
            </div>
        </div>
    );
}
