import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

export default function PreviewTimeline({ values }: Props) {
  const p = useLanguage().t.preview.timeline;
  const events = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    date: values[`event${n}Date`] || "",
    title: values[`event${n}Title`] || "",
    desc: values[`event${n}Desc`] || "",
  })).filter((e) => e.date || e.title);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-cream to-blush">
      <div className="max-w-4xl mx-auto">
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
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />

          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                  <p className="text-sm text-primary/60 font-semibold uppercase tracking-wider mb-1">
                    {event.date}
                  </p>
                  <h3 className="text-2xl font-playfair font-bold text-foreground mb-2">{event.title}</h3>
                  <p className="text-foreground/70 font-script text-lg leading-relaxed">{event.desc}</p>
                </div>

                {/* Center dot */}
                <div className="relative z-10 shrink-0">
                  <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-glow-gold">
                    <Heart className="w-5 h-5 text-foreground fill-foreground/20" />
                  </div>
                </div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
