import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 1 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-romantic"
    >
      <div className="text-center">
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
          <Heart className="w-20 h-20 mx-auto text-rose-gold fill-rose-gold" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-xl font-script text-foreground"
        >
          Preparing something special...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;
