import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Props { values: Record<string, string> }

export default function PreviewFloatingDecoration({ values }: Props) {
  const count = Math.min(30, Math.max(5, parseInt(values.count || "15", 10) || 15));
  const color = values.color || "#e11d48";

  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i / count) * 100}%`,
    delay: (i * 0.7) % 10,
    duration: 10 + (i % 5) * 2,
    size: 16 + (i % 4) * 8,
  }));

  return (
    <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blush/30 to-lavender/30">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "100%", opacity: 1, rotate: 0 }}
            animate={{ y: "-100%", opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration: heart.duration, delay: heart.delay, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", left: heart.left, top: 0 }}
          >
            <Heart
              style={{ width: heart.size, height: heart.size, color, fill: color, opacity: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
}
