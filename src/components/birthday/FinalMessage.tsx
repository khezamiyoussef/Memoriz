import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const FinalMessage = () => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-lavender via-blush to-cream">
      {/* Animated sparkles */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute w-2 h-2 bg-gold rounded-full"
            />
          ))}
        </div>
      )}

      <div className="text-center px-4 max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <p className="text-2xl md:text-3xl text-foreground/80 font-sans leading-relaxed">
            Thank you for being the best part of my every day.
          </p>
          <p className="text-3xl md:text-4xl text-foreground font-semibold">
            I love you more than words can ever express.
          </p>
          <p className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
            Happy Valentine's Day, my everything.
          </p>

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            className="py-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-32 h-32 mx-auto text-rose-gold fill-rose-gold" />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="text-3xl font-script text-foreground pt-8"
          >
            Forever yours,
            <br />
            <span className="text-4xl">Youssef</span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-sm text-muted-foreground"
        >
          <p className="font-script">
            Made with endless love, just for you ♡
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalMessage;
