import { motion } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

export default function PreviewHero({ values }: Props) {
  const p = useLanguage().t.preview.hero;
  const sectionRef = useRef<HTMLElement>(null);

  // Each section is wrapped in its own element by SiteSections, so the next
  // section is the wrapper's next sibling.
  const scrollToNext = () => {
    const next = sectionRef.current?.parentElement?.nextElementSibling;
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: values.backgroundImage
          ? `url("${values.backgroundImage}")`
          : "linear-gradient(135deg, #fce7f3, #e9d5ff, #fef3c7)",
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blush/40 via-lavender/30 to-cream/50" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-script text-foreground mb-6"
        >
          {values.title || p.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-foreground/80 font-sans max-w-2xl mx-auto mb-12"
        >
          {values.subtitle || p.subtitle}
        </motion.p>

        {values.buttonText && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
            className="group relative px-12 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 bg-gradient-gold rounded-full text-foreground font-semibold text-lg shadow-glow-gold hover:shadow-glow-romantic transition-all duration-300"
          >
            <span className="relative z-10">{values.buttonText}</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gold/20 blur-lg"
            />
          </motion.button>
        )}
      </div>
    </section>
  );
}
