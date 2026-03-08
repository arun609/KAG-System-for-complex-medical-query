import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial user preference or system setting
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            setIsDark(true);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`
        p-2 rounded-full border transition-all duration-300
        ${isDark
                    ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(253,224,71,0.3)]"
                    : "bg-white border-slate-200 text-orange-500 hover:shadow-md"
                }
      `}
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.div>
        </motion.button>
    );
}
