import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import imgNotes from "@/pictures/IMG_0101.jpeg?url";
import imgSmile from "@/pictures/IMG_0142.jpeg?url";
import imgSunset from "@/pictures/IMG_0150.jpeg?url";
import imgLaugh from "@/pictures/IMG_0172.jpeg?url";
import imgCozy from "@/pictures/IMG_0204.jpeg?url";
import imgAdventure from "@/pictures/IMG_0205.jpeg?url";
import imgHoodie from "@/pictures/IMG_0270.jpeg?url";
import imgTogether from "@/pictures/IMG_0288.jpeg?url";
import imgDreamy from "@/pictures/IMG_0306.jpeg?url";
import imgCuddles from "@/pictures/IMG_0370.jpeg?url";

const carouselMemories = [
  {
    src: imgNotes,
    title: "Voice Notes & Midnight Chats",
    description: "Every ping, every 'hey love' pulls me closer no matter the miles.",
  },
  {
    src: imgSmile,
    title: "Your Laugh",
    description: "That smile is my favorite sunrise, even through a screen.",
  },
  {
    src: imgSunset,
    title: "Sunset Promises",
    description: "Counting down until we finally stand under skies like this in the same place.",
  },
  {
    src: imgLaugh,
    title: "Your Soft Heart",
    description: "The way you care for me from afar, even when I'm chaos, melts everything.",
  },
  {
    src: imgCozy,
    title: "Cozy Calls",
    description: "Blankets, tea, and your voice are my calm, every single time.",
  },
  {
    src: imgAdventure,
    title: "Adventures Waiting",
    description: "There are cities waiting for our laughter and secret jokes.",
  },
  {
    src: imgHoodie,
    title: "Hoodies & Hugs",
    description: "Seeing you wear my hoodie through the camera somehow gives me all the warmth back.",
  },
  {
    src: imgTogether,
    title: "Our Forever Energy",
    description: "You give, I give, and even across time zones we both feel fuller.",
  },
  {
    src: imgDreamy,
    title: "Kitchen Dances",
    description: "Video call dance breaks, happy screams—our favorite kind of therapy.",
  },
  {
    src: imgCuddles,
    title: "Quiet Moments",
    description: "Being still on a call with you is louder than any big gesture.",
  },
];

const MemoriesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselMemories.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const showPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselMemories.length) % carouselMemories.length);
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselMemories.length);
  };

  const currentMemory = carouselMemories[currentIndex];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-blush to-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-foreground/60 font-semibold mb-4">
            We Will Make Millions Of Memories Ya Rouhi
          </p>
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Everything in Pictures
          </h2>
          <p className="text-xl text-foreground/70 font-script max-w-3xl mx-auto">
            Here's a glimpse of the moments we've created across countries, and a reminder that the
            best ones are still on their way.
          </p>
        </motion.div>

        <div className="relative max-w-xl mx-auto">
          <div
            className="relative overflow-hidden rounded-[2.5rem] shadow-glow-romantic border border-white/30 bg-black/10 w-full"
            style={{ aspectRatio: "3 / 4" }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentMemory.src}
                src={currentMemory.src}
                alt={currentMemory.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-0 right-0 text-center px-8">
              <motion.h3
                key={currentMemory.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-playfair text-white mb-3"
              >
                {currentMemory.title}
              </motion.h3>
              <motion.p
                key={currentMemory.description}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-white/80 font-script"
              >
                {currentMemory.description}
              </motion.p>
            </div>
          </div>

          <button
            onClick={showPrev}
            aria-label="Previous memory"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/80 hover:bg-white text-rose-gold rounded-full w-14 h-14 shadow-soft transition"
          >
            ‹
          </button>
          <button
            onClick={showNext}
            aria-label="Next memory"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/80 hover:bg-white text-rose-gold rounded-full w-14 h-14 shadow-soft transition"
          >
            ›
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          {carouselMemories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === currentIndex ? "bg-rose-gold scale-110" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Show memory ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemoriesCarousel;
