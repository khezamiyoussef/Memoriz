import { motion } from "framer-motion";
import floralImage from "@/assets/flowers-decoration.jpg";

const MaryemNameSection = () => {
  const meanings = [
    { title: "Beloved", description: "Because everyone who meets you feels held and chosen." },
    {
      title: "Rebellious",
      description: "Because you challenge the distance, the odds, and even me—always for the better.",
    },
    { title: "Bitter", description: "Because even the hard moments sharpen the sweetness of loving you." },
    {
      title: "Drop of the Sea",
      description: "Because your presence is vast, calm, and endlessly deep, even through a screen.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 px-6 bg-cream">
      <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: `url(${floralImage})` }} />
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.5em] text-foreground/60 mb-4"
        >
          Maryem · Maryam · Miriam
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6"
        >
          The Many Meanings Of Your Name
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-foreground/80 font-script mb-12"
        >
          Maryem is a variant of Maryam, the Arabic form of Miriam. People debate its meanings, but somehow
          you carry every single one with grace.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {meanings.map((meaning, index) => (
            <motion.div
              key={meaning.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 rounded-3xl p-6 shadow-soft border border-primary/20"
            >
              <h3 className="text-2xl font-playfair font-semibold text-foreground mb-3">{meaning.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{meaning.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaryemNameSection;
