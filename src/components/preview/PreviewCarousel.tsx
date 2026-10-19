import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

export default function PreviewCarousel({ values }: Props) {
  const p = useLanguage().t.preview.carousel;
  const slides = [1, 2, 3]
    .map((n) => ({
      src: values[`slide${n}Image`] || "",
      title: values[`slide${n}Caption`] || p.slide(n),
      description: "",
    }))
    .filter((s) => s.src || s.title);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[currentIndex] ?? { src: "", title: p.noSlides, description: "" };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-blush to-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            {values.title || p.title}
          </h2>
        </motion.div>

        <div className="relative max-w-xl mx-auto">
          <div
            className="relative overflow-hidden rounded-[2.5rem] shadow-glow-romantic border border-white/30 bg-black/10 w-full"
            style={{ aspectRatio: "3 / 4" }}
          >
            <AnimatePresence mode="wait">
              {current.src ? (
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center">
                  <span className="text-6xl">🎠</span>
                </div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-0 right-0 text-center px-8">
              <motion.h3
                key={current.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-playfair text-white mb-3"
              >
                {current.title}
              </motion.h3>
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((p) => (p - 1 + slides.length) % slides.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/80 hover:bg-white text-rose-gold rounded-full w-14 h-14 shadow-soft transition text-2xl"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentIndex((p) => (p + 1) % slides.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/80 hover:bg-white text-rose-gold rounded-full w-14 h-14 shadow-soft transition text-2xl"
              >
                ›
              </button>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition ${
                  idx === currentIndex ? "bg-rose-gold scale-110" : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
