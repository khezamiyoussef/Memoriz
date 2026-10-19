import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

const NOTE_COLORS = [
  "from-rose-100 to-pink-50 border-rose-200 text-rose-800",
  "from-amber-100 to-yellow-50 border-amber-200 text-amber-800",
  "from-violet-100 to-purple-50 border-violet-200 text-violet-800",
  "from-sky-100 to-blue-50 border-sky-200 text-sky-800",
  "from-emerald-100 to-green-50 border-emerald-200 text-emerald-800",
];

export default function PreviewPromiseJar({ values }: Props) {
  const p = useLanguage().t.preview.promiseJar;
  const [opened, setOpened] = useState<number[]>([]);
  const jarColor = values.jarColor || "#f59e0b";

  const promises = [1, 2, 3, 4, 5]
    .map((n) => values[`promise${n}`])
    .filter(Boolean);

  const toggle = (i: number) =>
    setOpened((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-amber-50/60 to-rose-50/60">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          {/* Jar SVG illustration */}
          <div className="flex justify-center mb-6">
            <svg
              viewBox="0 0 100 120"
              className="w-28 h-28 drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lid */}
              <rect x="28" y="8" width="44" height="14" rx="4" fill={jarColor} opacity="0.9" />
              <rect x="34" y="4" width="32" height="8" rx="3" fill={jarColor} />
              {/* Jar body */}
              <path
                d="M22 22 Q18 26 18 32 L18 100 Q18 110 28 112 L72 112 Q82 110 82 100 L82 32 Q82 26 78 22 Z"
                fill="white"
                stroke={jarColor}
                strokeWidth="2.5"
                opacity="0.85"
              />
              {/* Shine */}
              <path d="M28 36 Q30 50 28 70" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              {/* Notes peeking out */}
              {promises.slice(0, 3).map((_, i) => (
                <rect
                  key={i}
                  x={32 + i * 10}
                  y={20 + i * 3}
                  width="14"
                  height="10"
                  rx="2"
                  fill={["#fda4af", "#fcd34d", "#c4b5fd"][i]}
                  opacity="0.9"
                  transform={`rotate(${[-8, 4, -3][i]}, ${39 + i * 10}, 25)`}
                />
              ))}
            </svg>
          </div>

          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-3">
            {values.title || p.title}
          </h2>
          <p className="text-lg text-foreground/50 font-script">
            {values.subtitle || p.subtitle}
          </p>
        </motion.div>

        {/* Promise notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {promises.map((promise, i) => {
            const isOpen = opened.includes(i);
            const colorClass = NOTE_COLORS[i % NOTE_COLORS.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, rotate: (i % 2 === 0 ? -2 : 2) }}
                whileInView={{ opacity: 1, y: 0, rotate: isOpen ? 0 : (i % 2 === 0 ? -1 : 1) }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative cursor-pointer select-none`}
                onClick={() => toggle(i)}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 0 : (i % 2 === 0 ? -1.5 : 1.5) }}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`rounded-2xl border bg-gradient-to-br ${colorClass} shadow-md p-5 min-h-[110px] flex flex-col items-center justify-center`}
                >
                  {/* Folded corner */}
                  <div
                    className="absolute top-0 right-0 w-8 h-8 rounded-bl-xl rounded-tr-2xl opacity-30"
                    style={{ background: "rgba(0,0,0,0.1)" }}
                  />

                  {/* Closed / open state */}
                  <AnimatePresence mode="wait">
                    {!isOpen ? (
                      <motion.div
                        key="closed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center h-full gap-2 py-2"
                      >
                        <span className="text-3xl">💌</span>
                        <span className="text-xs font-medium opacity-60">Promise #{i + 1}</span>
                        <span className="text-xs opacity-40">{p.tapToOpen}</span>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="open"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full text-sm font-script leading-relaxed text-center"
                      >
                        {promise}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center text-foreground/30 text-sm mt-10 font-script"
        >
          {opened.length === promises.length && promises.length > 0
            ? p.allRead
            : p.remaining(promises.length - opened.length)}
        </motion.p>
      </div>
    </section>
  );
}
