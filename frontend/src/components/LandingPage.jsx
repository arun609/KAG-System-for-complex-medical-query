
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import CircularCarousel from "./CircularCarousel";
import Logo from "./ui/Logo";
import ThemeToggle from './ui/ThemeToggle';

export default function LandingPage({ onEnter }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEnter = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden"
    >
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto pt-4">

        {/* Header Section (Logo + Title) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-6"
        >
          <Logo size="lg" />
          <h1 className="text-4xl md:text-6xl font-serif font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-medical-primary to-medical-accent mt-2 mb-2 tracking-tight drop-shadow-sm">
            KAG Medical
          </h1>
          <p className="text-xl md:text-2xl text-medical-primary/80 font-light tracking-[0.2em] uppercase">
            Query System
          </p>
        </motion.div>

        {/* Carousel Section */}
        {/* Compacted margins */}
        <div className="w-full mb-4 transform scale-100 md:scale-110">
          <CircularCarousel />
        </div>

        {/* Action Section */}
        <div className="text-center relative z-20 mt-0">
          <p className="text-medical-muted text-lg mb-4 max-w-xl mx-auto leading-relaxed font-light">
            Advanced biomedical knowledge graphs powered by Knowledge-Augmented Generation.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, letterSpacing: "0.1em" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="group relative px-12 py-4 bg-medical-text text-medical-surface font-bold text-lg hover:bg-medical-primary transition-all duration-500 shadow-xl rounded-sm uppercase tracking-wider"
          >
            <span className="flex items-center gap-3 relative z-10">
              Enter System
            </span>
          </motion.button>

          <p className="text-medical-primary/50 text-xs mt-6 font-mono tracking-widest">
            {isAnimating ? 'INITIALIZING NEURAL LINK...' : 'SYSTEM READY'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}