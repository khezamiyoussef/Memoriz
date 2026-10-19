import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

export default function PreviewFinalMessage({ values }: Props) {
  const p = useLanguage().t.preview.finalMessage;
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSparkles(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-lavender via-blush to-cream">
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: Math.random() * 800, y: Math.random() * 600 }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
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
            {values.line1 || p.line1}
          </p>
          <p className="text-3xl md:text-4xl text-foreground font-semibold">
            {values.line2 || p.line2}
          </p>
          <p className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
            {values.headline || p.headline}
          </p>

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            className="py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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
            {values.closing || p.closing}
            <br />
            <span className="text-4xl">{values.signature || p.signature}</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
