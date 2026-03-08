import React from "react";
import { motion } from "framer-motion";

// --- Replace these with your actual image paths ---
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";

// Duplicate the array to ensure seamless infinite scrolling
const images = [image1, image2, image3, image4, image5, image1, image2, image3, image4, image5];

export default function CircularCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-12 perspective-[1000px]">
      {/* 
        Side Gradients - Kept for smooth entry/exit 
      */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-medical-secondary to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-medical-secondary to-transparent z-10 pointer-events-none" />

      {/* Moving Track */}
      <motion.div
        className="flex gap-12 px-4"
        // Move exactly 50% continuously
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35, // Slow linear slide
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {images.map((img, index) => (
          <motion.div
            key={index}
            // "Subtle / Feel like one":
            // - Removed border and heavy shadow
            // - Added opacity-70 and slight grayscale to blend into background
            // - Hover restores full color and opacity
            className="relative flex-shrink-0 w-[400px] h-[250px] rounded-2xl overflow-hidden bg-transparent group opacity-80 hover:opacity-100 grayscale-[20%] hover:grayscale-0 transition-all duration-500"

            // Removed rotation "tumble" as requested.
            // Keeping it flat and simple.
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
              style={{ backfaceVisibility: "hidden" }} // Hide back if needed, or let it show? Standard is hidden.
            />
            {/* If we rotate 360, we see the back. 
                Let's make the back double-sided or just duplicate the image?
                Actually, standard img tag with rotateY 180 shows reversed image.
                That's usually fine for abstract images. 
            */}

            {/* Subtle gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}