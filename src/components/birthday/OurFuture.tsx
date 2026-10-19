import { motion } from "framer-motion";
import { Home, Heart, Plane } from "lucide-react";
import cloudsImage from "@/assets/clouds-dreamy.jpg";

const futureVisions = [
  {
    icon: Home,
    title: "Our Future Home",
    description: "A cozy space filled with love and laughter",
  },
  {
    icon: Plane,
    title: "Our Adventures Ahead",
    description: "Exploring the world hand in hand",
  },
  {
    icon: Heart,
    title: "Forever Starts Today",
    description: "Growing old together, still holding hands",
  },
];

const OurFuture = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cloudsImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blush/60 to-lavender/70" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-6">
            Our Future Together
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Here's to many more birthdays together... to growing old and still holding hands, 
            still laughing at 2am, still choosing each other every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {futureVisions.map((vision, index) => {
            const Icon = vision.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-soft border border-primary/20 text-center"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block mb-4"
                >
                  <Icon className="w-16 h-16 text-rose-gold" />
                </motion.div>
                <h3 className="text-2xl font-playfair font-semibold text-foreground mb-3">
                  {vision.title}
                </h3>
                <p className="text-foreground/70 font-script text-lg">
                  {vision.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurFuture;
