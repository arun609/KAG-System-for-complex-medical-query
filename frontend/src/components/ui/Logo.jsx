import React from "react";
import { motion } from "framer-motion";
import logoSvg from "../../assets/vecteezy_snake-on-pole-doctor-symbol-vector_226341.svg";

export default function Logo({ size = "md", animated = false, className = "" }) {
    const sizes = {
        sm: "w-10 h-10",
        md: "w-16 h-16",
        lg: "w-32 h-32",
        xl: "w-48 h-48"
    };

    const iconSize = sizes[size] || sizes.md;

    // Heartbeat "Lup-Tup" Animation
    const heartbeatParams = {
        scale: [1, 1.15, 1, 1.25, 1],
        transition: {
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5
        }
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <motion.img
                src={logoSvg}
                alt="KAG Medical Logo"
                initial={false}
                animate={animated ? heartbeatParams : { scale: 1 }}
                // Added will-change-transform to help browser rendering
                className={`${iconSize} object-contain dark:invert drop-shadow-sm will-change-transform`}
            />
        </div>
    );
}
