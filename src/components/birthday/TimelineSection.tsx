import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const milestones = [
  {
    emoji: "💞",
    date: "The Beginning",
    title: "The day we became one",
    description: "I will never forget our date at the bar, I knew you were special.",
  },
  {
    emoji: "🍝",
    date: "Our First Date",
    title: "Pasta, pizza and drinks fl fac turned into hours",
    description: "Time flew by, and I didn't want the day to end.",
  },
  {
    emoji: "❤️",
    date: "First 'I Love You'",
    title: "29.09.2025 until nkoulhelek fl denya",
    description: "The moment I knew I wanted forever with you.",
  },
  {
    emoji: "✈️",
    date: "First Flight Together",
    title: "From \"Essif ljey hata l the end of time\" to doing it sooner",
    description: "You made my year ki jit bahdheya w kaadt aandi.",
  },
  {
    emoji: "📣",
    date: "It's Official Now",
    title: "Lness lkol taaref",
    description: "Farhan barcha li menesh bkhobin chay aal ness li lezemha taaref.",
  },
  {
    emoji: "👕",
    date: "That One Time",
    title: "When you took my football shirt",
    description: "And looked better in it than I ever could.",
  },
];

const TimelineItem = ({ milestone, index }: { milestone: typeof milestones[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex items-center gap-8 mb-16 ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-primary/10"
        >
          <p className="text-sm text-muted-foreground font-script mb-2">{milestone.date}</p>
          <h3 className="text-2xl font-playfair font-semibold text-foreground mb-3">
            {milestone.title}
          </h3>
          <p className="text-foreground/70">{milestone.description}</p>
        </motion.div>
      </div>

      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center shadow-glow-gold"
        >
          <span className="text-3xl leading-none" aria-hidden="true">
            {milestone.emoji}
          </span>
        </motion.div>
        {index < milestones.length - 1 && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-primary to-transparent" />
        )}
      </div>

      <div className="flex-1" />
    </motion.div>
  );
};

const TimelineSection = () => {
  return (
    <section id="timeline" className="py-24 px-4 bg-gradient-to-b from-cream to-blush">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Our Love Story
          </h2>
          <p className="text-xl text-foreground/70 font-script">
            Every moment with you is a chapter I never want to end
          </p>
        </motion.div>

        <div className="relative">
          {milestones.map((milestone, index) => (
            <TimelineItem key={index} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
