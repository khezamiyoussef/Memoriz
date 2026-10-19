import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";

const MakeAWish = () => {
  const [wish, setWish] = useState("");
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const wishInbox = import.meta.env.VITE_WISH_EMAIL_TO?.trim();

  const markSent = () => {
    setSent(true);
    setTimeout(() => {
      setWish("");
      setSent(false);
    }, 3000);
  };

  const handleSend = async () => {
    const trimmedWish = wish.trim();
    if (!trimmedWish) return;

    if (!wishInbox) {
      setError("Set VITE_WISH_EMAIL_TO in your .env file to receive wishes by email.");
      return;
    }

    setError("");
    setIsSending(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(wishInbox)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "New Valentine Wish",
          message: trimmedWish,
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send with FormSubmit.");
      }

      markSent();
    } catch {
      const subject = encodeURIComponent("New Valentine Wish");
      const body = encodeURIComponent(trimmedWish);
      window.location.href = `mailto:${wishInbox}?subject=${subject}&body=${body}`;
      markSent();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-lavender to-cream">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Make a Wish
          </h2>
          <p className="text-xl text-foreground/70 font-script mb-12">
            Close your eyes and wish for something magical...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative inline-block"
            >
              <div className="w-4 h-16 bg-gradient-to-b from-accent to-gold mx-auto rounded-t-full" />
              <motion.div
                animate={{
                  y: [-5, -10, -5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 left-1/2 -translate-x-1/2"
              >
                <div className="w-8 h-12 bg-gradient-to-t from-accent via-gold to-transparent rounded-full blur-sm" />
              </motion.div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Type your wish here..."
                  className="w-full p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-script text-lg resize-none h-32"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isSending || !wish.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  whileDisabled={{ scale: 1 }}
                  className="px-8 py-4 bg-gradient-gold rounded-full text-foreground font-semibold text-lg shadow-glow-gold hover:shadow-glow-romantic transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSending ? "Sending..." : "Send to the Universe"}
                </motion.button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </motion.div>
            ) : (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  <Sparkles className="w-16 h-16 mx-auto text-gold mb-4" />
                </motion.div>
                <p className="text-2xl font-script text-foreground">Your wish has been sent to the stars...</p>
                <p className="text-lg text-foreground/70 mt-2">and I will do everything to make it come true.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default MakeAWish;
