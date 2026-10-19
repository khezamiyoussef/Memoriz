import { motion } from "framer-motion";
import flowersImage from "@/assets/flowers-decoration.jpg";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

export default function PreviewNameDisplay({ values }: Props) {
  const p = useLanguage().t.preview.nameDisplay;
  const name = values.name || p.name;
  const meanings = [1, 2, 3, 4].map((n) => ({
    title: values[`meaning${n}`] || "",
    description: values[`meaning${n}Desc`] || "",
  })).filter((m) => m.title);

  return (
    <section className="relative overflow-hidden py-24 px-6 bg-cream">
      <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: `url(${flowersImage})` }} />
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.5em] text-foreground/60 mb-4"
        >
          {name}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6"
        >
          The Many Meanings Of {name}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-foreground/80 font-script mb-12"
        >
          {name} carries every one of its meanings with grace.
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
}
