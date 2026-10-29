import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { OPERATOR } from "@/content/legal";

// Links to the legal pages; the Legal notice must be reachable from every page.
// `reportSlug` adds a link to report a published page (DSA notice and action).
export default function LegalFooter({ reportSlug, className = "" }: { reportSlug?: string; className?: string }) {
  const { t } = useLanguage();
  const linkClass = "hover:text-gray-800 hover:underline";

  return (
    <footer className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600 ${className}`}>
      {reportSlug && <span>{t.legal.madeWith}</span>}
      <Link to="/legal/imprint" className={linkClass}>{t.legal.imprint}</Link>
      <Link to="/legal/privacy" className={linkClass}>{t.legal.privacy}</Link>
      <Link to="/legal/terms" className={linkClass}>{t.legal.terms}</Link>
      {reportSlug && (
        <a
          href={`mailto:${OPERATOR.email}?subject=${encodeURIComponent(`Report: /${reportSlug}`)}`}
          className={linkClass}
        >
          {t.legal.report}
        </a>
      )}
    </footer>
  );
}
