import { motion } from 'framer-motion';

const Background = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-medical-secondary transition-colors duration-500">
            {/* Subtle Gradient Spotlights (Classy/Soft) */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-30 blur-[120px] bg-medical-primary/20 animate-pulse-slow"
            />
            <div
                className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-30 blur-[120px] bg-medical-accent/20 animate-pulse-slow"
                style={{ animationDelay: '2s' }}
            />

            {/* Grid Pattern (Very Faint) */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    color: 'var(--medical-text)'
                }}
            />
        </div>
    );
};

export default Background;
