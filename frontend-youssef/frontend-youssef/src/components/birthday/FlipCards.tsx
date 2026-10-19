import { motion } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  HandHeart,
  Clock3,
  BatteryCharging,
  Sparkles,
  Shield,
  PhoneCall,
  Heart,
  Smile,
  Coffee,
  Music,
  Moon,
  Star,
  Sun,
} from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    reason: "We conquer distance between us like it's nothing because we always choose each other.",
  },
  {
    icon: HandHeart,
    reason: "You stay gentle with me even when I'm angry or out of control, loving me back to calm.",
  },
  {
    icon: Clock3,
    reason: "You give me your time, even when the day has already taken most of it from you.",
  },
  {
    icon: BatteryCharging,
    reason: "You pour your energy into us and somehow still recharge me when I'm empty, hedhi mankhalikesh thessha khater dima aandi energy ama it`s all for you and our future together",
  },
  {
    icon: Sparkles,
    reason: "The way you make me feel—seen, adored, and like home—no matter the distance.",
  },
  {
    icon: Shield,
    reason: "You make me feel safe enough to be honest, and completely myself.",
  },
  {
    icon: PhoneCall,
    reason: "Your calls, texts, facebook videos hihi and little check-ins make the distance feel like next door.",
  },
  {
    icon: Heart,
    reason: "Every day you give me love, time, and grace, and it heals parts of me I never knew how to fix.",
  },
  
];

const FlipCard = ({ item, index }: { item: typeof reasons[0]; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = item.icon;

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
        {/* Front */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blush to-lavender rounded-2xl shadow-soft flex items-center justify-center p-6 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center">
            <Icon className="w-16 h-16 mx-auto mb-4 text-foreground" />
            <p className="text-lg font-semibold text-foreground">Tap to reveal</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-gradient-gold rounded-2xl shadow-glow-gold flex items-center justify-center p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-center text-lg font-script text-foreground leading-relaxed">
            {item.reason}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FlipCards = () => {
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
            Why I Love You
          </h2>
          <p className="text-xl text-foreground/70 font-script">
            There are infinite reasons, but here are just a few...
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => (
            <FlipCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlipCards;
