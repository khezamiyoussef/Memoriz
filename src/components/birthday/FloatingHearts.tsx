import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 10,
    size: 16 + Math.random() * 16,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: "100vh", opacity: 1, rotate: 0 }}
          animate={{
            y: "-100vh",
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: heart.left,
            top: 0,
          }}
        >
          <Heart
            className="text-primary/30 fill-primary/20"
            style={{ width: heart.size, height: heart.size }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
