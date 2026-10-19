import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import photoHoodie from "@/pictures/E255D752-D415-4A50-A474-3BB999D12F86.jpeg?url";
import photoLaugh from "@/pictures/IMG_0101.jpeg?url";
import photoBeach from "@/pictures/IMG_0142.jpeg?url";
import photoBreakfast from "@/pictures/IMG_0150.jpeg?url";
import photoMovieNight from "@/pictures/IMG_0172.jpeg?url";
import photoKitchenDance from "@/pictures/IMG_0204.jpeg?url";
import photoAdventure from "@/pictures/IMG_0205.jpeg?url";
import photoSmile from "@/pictures/IMG_0270.jpeg?url";
import photoSunset from "@/pictures/IMG_0288.jpeg?url";
import photoMorningCoffee from "@/pictures/IMG_0492.jpeg?url";

type PhotoMemory = {
  caption: string;
  rotation: number;
  src?: string;
};

const photos: PhotoMemory[] = [
  { caption: "Anytime you`re in my car", rotation: -3, src: photoHoodie },
  { caption: "dhahartli manesthak nkoul chay", rotation: 2, src: photoLaugh },
  { caption: "How can a person be this beautiful when this tired?", rotation: -2, src: photoBeach },
  { caption: "The lips...", rotation: 4, src: photoBreakfast },
  { caption: "A proud gf is all I want you to be ya rouhi", rotation: -4, src: photoMovieNight },
  { caption: "Enti kaada toghzrelna dancing in the kitchen one day", rotation: 3, src: photoKitchenDance },
  { caption: "Can't wait for the next adventure with you", rotation: -1, src: photoAdventure },
  { caption: "Can't wait to wake up to your smile again", rotation: 2, src: photoSmile },
  { caption: "Can't wait for our next sunset together", rotation: -3, src: photoSunset },
  { caption: "Can't wait bch nochreb kahwti kol sbeh ya rouhi", rotation: 1, src: photoMorningCoffee },
];

const PhotoCard = ({ photo, index }: { photo: PhotoMemory; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      whileInView={{ opacity: 1, scale: 1, rotate: photo.rotation }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
      className="relative bg-white p-3 shadow-soft hover:shadow-glow-romantic transition-shadow duration-300 cursor-pointer"
      style={{ rotate: photo.rotation }}
    >
      {/* Photo / Placeholder */}
      <div className="aspect-square rounded-sm relative overflow-hidden bg-slate-100">
        {photo.src ? (
          <>
            <motion.img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blush to-lavender text-white text-center px-4">
            <Heart className="w-12 h-12 text-white fill-white/30" />
            <span className="text-lg font-script leading-tight">{photo.caption}</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 text-xs text-white/80 font-script">
          {photo.src ? `Photo ${index + 1}` : "Can't Wait"}
        </div>
      </div>

      {/* Corner heart decoration */}
      <Heart className="absolute -top-2 -right-2 w-6 h-6 text-rose-gold fill-rose-gold" />
    </motion.div>
  );
};

const PhotoGallery = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-lavender to-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Our Beautiful Memories
          </h2>
          <p className="text-xl text-foreground/70 font-script">
            Every picture tells a story of us
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {photos.map((photo, index) => (
            <PhotoCard key={index} photo={photo} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PhotoGallery;
