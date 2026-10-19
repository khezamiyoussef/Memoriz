import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-romantic.jpg";

const HeroSection = () => {
  const scrollToNext = () => {
    const timeline = document.getElementById("timeline");
    timeline?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blush/40 via-lavender/30 to-cream/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-script text-foreground mb-6"
        >
          Happy Valentine, rabi ykhalina lbaadhna
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-foreground/80 font-sans max-w-2xl mx-auto mb-12"
        >
          توحشت ريحتك برشا
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToNext}
          className="group relative px-12 py-4 bg-gradient-gold rounded-full text-foreground font-semibold text-lg shadow-glow-gold hover:shadow-glow-romantic transition-all duration-300"
        >
          <span className="relative z-10">Enter</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gold/20 blur-lg"
          />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-8 h-8 text-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
