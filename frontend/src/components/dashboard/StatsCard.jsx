import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, label, icon: Icon, color = 'blue', trend }) {
    const colorMap = {
        blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
        green: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
        purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
        orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                {label && <p className="text-xs text-slate-400 mt-2">{label}</p>}
            </div>
        </motion.div>
    );
}
