import { motion } from "framer-motion";
import { Gift, Music, Sparkles } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";

const Surprises = () => {
  const [revealed, setRevealed] = useState<number[]>([]);

  const handleSurprise = (index: number) => {
    if (revealed.includes(index)) return;

    setRevealed([...revealed, index]);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFE5EC", "#E8B4BC", "#E6D9F5", "#FFD700"],
    });
  };

  const surprises = [
    {
      icon: Sparkles,
      title: "Surprise #1",
      revealed: "Weekend fi Vienne maksous doub tji bahdheya! ✈️",
    },
    {
      icon: Music,
      title: "Surprise #2",
      revealed: "A custom playlist of all the songs that remind me of you tjik maa lcadeauet 🎵",
    },
    {
      icon: Gift,
      title: "Surprise #3",
      revealed: "1000 kisses hak tselhomli 💋",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-blush to-lavender">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            I Have a Few Little Surprises
          </h2>
          <p className="text-xl text-foreground/70 font-script">
            Click each box to reveal...
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {surprises.map((surprise, index) => {
            const Icon = surprise.icon;
            const isRevealed = revealed.includes(index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.button
                  onClick={() => handleSurprise(index)}
                  whileHover={{ scale: isRevealed ? 1 : 1.05 }}
                  whileTap={{ scale: isRevealed ? 1 : 0.95 }}
                  className={`w-full h-80 rounded-3xl shadow-soft transition-all duration-500 ${
                    isRevealed
                      ? "bg-gradient-gold shadow-glow-gold"
                      : "bg-white hover:shadow-glow-romantic"
                  }`}
                  disabled={isRevealed}
                >
                  <div className="h-full flex flex-col items-center justify-center p-8">
                    {!isRevealed ? (
                      <>
                        <Icon className="w-20 h-20 text-rose-gold mb-4" />
                        <p className="text-xl font-semibold text-foreground">
                          {surprise.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 font-script">
                          Click to reveal
                        </p>
                      </>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl font-script text-foreground text-center leading-relaxed"
                      >
                        {surprise.revealed}
                      </motion.p>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Surprises;
