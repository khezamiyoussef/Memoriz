import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Sparkles, Star } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

const ICONS = [Sparkles, Heart, Star];

export default function PreviewFlipCards({ values }: Props) {
  const p = useLanguage().t.preview.flipCards;
  const cards = [
    { front: values.card1Front || p.cards[0].front, back: values.card1Back || p.cards[0].back },
    { front: values.card2Front || p.cards[1].front, back: values.card2Back || p.cards[1].back },
    { front: values.card3Front || p.cards[2].front, back: values.card3Back || p.cards[2].back },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-cream to-blush">
      <div className="max-w-7xl mx-auto">
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
          <p className="text-xl text-foreground/70 font-script">
            {p.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <FlipCard key={index} card={card} index={index} Icon={ICONS[index % ICONS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ card, index, Icon }: { card: { front: string; back: string }; index: number; Icon: React.ComponentType<{ className?: string }> }) {
  const { tapToReveal } = useLanguage().t.preview.flipCards;
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        className="relative w-full h-64 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.05 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-blush to-lavender rounded-2xl shadow-soft flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center">
            <Icon className="w-16 h-16 mx-auto mb-4 text-foreground" />
            <p className="text-lg font-semibold text-foreground">{card.front}</p>
            <p className="text-sm text-foreground/60 mt-2 font-script">{tapToReveal}</p>
          </div>
        </div>
        <div
          className="absolute inset-0 bg-gradient-gold rounded-2xl shadow-glow-gold flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-center text-lg font-script text-foreground leading-relaxed">{card.back}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
