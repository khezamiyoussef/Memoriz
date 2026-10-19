import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import flowersImage from "@/assets/flowers-decoration.jpg";

const letterText = [
  "Maryem,",
  "",
  "You are my gift in this cruel world hak kaada tchouf denya kifeh.",
  "I wake up and you are my first thought. I fall asleep and dream of you. Somehow, you live in every moment in between.",
  "",
  "Loving you has changed me in ways I never expected kima dima nkolek.",
  "You changed how I move through life, how I think, and how I dream about the future. Nheb nkolek yaaychek baaarcha khater love does not feel loud or forced, it feels natural, safe, and deeply right.",
  "",
  "Before you, I was searching.",
  "With you, I finally feel at home.",
  "",
  "So take my hand. It is just you and me, today, tomorrow, forever, for as long as you keep letting me love you.",
  "",
  "Jit bch nebda nekteb blaarbi baad kolt nkhali laarbi ki netkablou wala peut etre nkhali chfeyfi yahkiw ki netkablou.",
  "Ya rouhi, my dream is to be your safe space. I want to be the place where you can rest, where you can be vulnerable without fear, where you are always understood and never judged.",
  "I need to be better wenti taawen feya aalekher w taaref t containini.",
  "",
  "When you come to live with me, I want you to grow, evolve, heal, win, learn, love, and slowly let go of everything that ever held you back fi Tounes.",
  "I want our life to be a place where you bloom into the fullest version of yourself w saddakni bch naawnek w will make sure you are the best version of yourself kol segounda.",
  "",
  "I love the quiet moments as much as the big ones, the way your presence calms me, the way your voice softens my world, the way a single look from you can make everything feel okay.",
  "With you, I do not have to pretend. I can just be, and that is more than enough.",
  "",
  "Everything is yours, and you are mine.",
  "My heart, my time, my future, all of it belongs to us.",
  "I do not promise perfection, but I promise honesty, patience, effort, and a love that stays. A love that grows. A love that never stops choosing you.",
  "",
  "Happy Valentine's Day, my love.",
  "You are my today, my tomorrow, and all my forever.",
  "",
  "Forever yours,",
  "Youssef",
];

const boldParagraphs = new Set([
  "Everything is yours, and you are mine.",
  "Ya rouhi, my dream is to be your safe space. I want to be the place where you can rest, where you can be vulnerable without fear, where you are always understood and never judged.",
  "I need to be better wenti taawen feya aalekher w taaref t containini.",
  "You are my today, my tomorrow, and all my forever.",
]);

const LoveLetter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-4 bg-cream relative overflow-hidden">
      {/* Decorative flowers */}
      <div
        className="absolute top-0 left-0 w-64 h-64 opacity-20 bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${flowersImage})` }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-20 bg-contain bg-no-repeat rotate-180"
        style={{ backgroundImage: `url(${flowersImage})` }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            A Letter to You
          </h2>
        </motion.div>

        <motion.div
          ref={ref}
          className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-soft border-2 border-primary/20"
        >
          {letterText.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`${
                paragraph === ""
                  ? "mb-4"
                  : index === 0
                  ? "text-2xl font-script text-foreground mb-6"
                  : index === letterText.length - 2
                  ? "text-xl font-script text-right text-foreground mt-8"
                  : index === letterText.length - 1
                  ? "text-lg font-script text-right text-foreground italic"
                  : boldParagraphs.has(paragraph)
                  ? "text-lg text-foreground/80 leading-relaxed mb-4 font-bold"
                  : "text-lg text-foreground/80 leading-relaxed mb-4"
              }`}
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Decorative hearts */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: letterText.length * 0.15 + 0.5, duration: 0.5 }}
            className="flex justify-center mt-8 gap-2"
          >
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-rose-gold text-2xl">
                {"\u2665"}
                {"\u2661"}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoveLetter;
