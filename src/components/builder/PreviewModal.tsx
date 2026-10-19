import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasItem } from "../../types/builder";

import SiteSections from "../preview/SiteSections";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props {
  items: CanvasItem[];
  onClose: () => void;
}

export default function PreviewModal({ items, onClose }: Props) {
  const { t } = useLanguage();

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col"
      >
        {/* Preview toolbar */}
        <div className="shrink-0 bg-gray-900/95 text-white flex items-center gap-3 px-4 py-2.5 border-b border-white/10">
          <div className="flex-1 flex justify-center">
            <div className="bg-gray-800 text-gray-300 text-xs px-4 py-1 rounded-full flex items-center gap-2 border border-white/10">
              <ExternalLink className="w-3 h-3" />
              <span>{t.previewModal.live}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition px-2 py-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
            {t.previewModal.close}
          </button>
        </div>

        {/* Scrollable site content */}
        <div className="flex-1 overflow-y-auto bg-background">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <span className="text-6xl">🎨</span>
              <p className="text-lg font-medium">{t.previewModal.emptyTitle}</p>
              <p className="text-sm">{t.previewModal.emptyDesc}</p>
            </div>
          ) : (
            <SiteSections items={items} isPreview />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
