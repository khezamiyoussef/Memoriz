import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

const HeartCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleInteraction = () => {
      setCount((prev) => prev + 1);
    };

    // Listen for clicks anywhere on the page
    window.addEventListener("click", handleInteraction);
    
    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 bg-cream/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-soft flex items-center gap-2 border border-primary/20"
    >
      <Heart className="w-5 h-5 text-rose-gold fill-rose-gold animate-heartbeat" />
      <span className="text-sm font-medium text-foreground">
        {count} {count === 1 ? "heart" : "hearts"} spread
      </span>
    </motion.div>
  );
};

export default HeartCounter;
