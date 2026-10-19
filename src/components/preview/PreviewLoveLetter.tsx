import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import flowersImage from "@/assets/flowers-decoration.jpg";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

export default function PreviewLoveLetter({ values }: Props) {
  const p = useLanguage().t.preview.loveLetter;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const body = values.body || p.body;
  const paragraphs = body.split("\n").filter(Boolean);

  return (
    <section className="py-24 px-4 bg-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 opacity-20 bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${flowersImage})` }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 bg-contain bg-no-repeat rotate-180"
        style={{ backgroundImage: `url(${flowersImage})` }} />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            {p.heading}
          </h2>
        </motion.div>

        <motion.div
          ref={ref}
          className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-soft border-2 border-primary/20"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl font-script text-foreground mb-6"
          >
            {values.greeting || p.greeting}
          </motion.p>

          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: (i + 1) * 0.1 }}
              className="text-lg text-foreground/80 leading-relaxed mb-4"
            >
              {p}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: (paragraphs.length + 1) * 0.1 }}
            className="text-right mt-8"
          >
            <p className="text-xl font-script text-foreground">{values.closing || p.closing}</p>
            <p className="text-lg font-script text-foreground italic mt-1">{values.signature || p.signature}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center mt-8 gap-2"
          >
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-rose-gold text-2xl">♥♡</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
