import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string> }

export default function PreviewPhotoGallery({ values }: Props) {
  const p = useLanguage().t.preview.photoGallery;
  const photos = [1, 2, 3].map((n) => ({
    src: values[`photo${n}`] || "",
    caption: values[`caption${n}`] || p.memoryN(n),
    rotation: [-3, 2, -2][n - 1],
  }));

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
            {values.title || p.title}
          </h2>
          <p className="text-xl text-foreground/70 font-script">
            {p.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              whileInView={{ opacity: 1, scale: 1, rotate: photo.rotation }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
              className="relative bg-white p-3 shadow-soft hover:shadow-glow-romantic transition-shadow duration-300 cursor-pointer"
              style={{ rotate: photo.rotation }}
            >
              <div className="aspect-square rounded-sm relative overflow-hidden bg-slate-100">
                {photo.src ? (
                  <>
                    <motion.img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
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
                  {photo.src ? photo.caption : p.memory}
                </div>
              </div>
              <Heart className="absolute -top-2 -right-2 w-6 h-6 text-rose-gold fill-rose-gold" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
