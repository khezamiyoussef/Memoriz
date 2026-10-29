import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LegalFooter from "@/components/LegalFooter";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import { isLegalDocId, legalDocs, LEGAL_UPDATED } from "@/content/legal";
import memorizLogo from "@/assets/logo.png";
import NotFound from "./NotFound";

// Privacy Policy, Terms of Service and Legal notice, at /legal/<doc>.
export default function Legal() {
  const { doc } = useParams();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const content = isLegalDocId(doc) ? legalDocs[lang][doc] : null;

  useEffect(() => {
    if (content) document.title = `${content.title} · Memoriz`;
    return () => { document.title = "Memoriz"; };
  }, [content]);

  if (!content) return <NotFound />;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <article className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.legal.back}
          </button>
          <div role="group" aria-label={t.dashboard.language} className="flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-semibold">
            {(["en", "fr"] as Lang[]).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-md px-2 py-1 uppercase ${lang === code ? "bg-white text-gray-800 shadow-sm" : "text-gray-600"}`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <Link to="/" className="mb-6 inline-flex items-center gap-2">
          <img src={memorizLogo} alt="" className="h-8 w-8 object-contain" />
          <span className="font-bold text-gray-800">Memoriz</span>
        </Link>
        <h1 className="mb-1 text-3xl font-bold text-gray-900">{content.title}</h1>
        <p className="mb-8 text-sm text-gray-600">
          {t.legal.lastUpdated}: {LEGAL_UPDATED}
        </p>

        {content.sections.map((section, i) => (
          <section key={i} className="mb-6">
            {section.heading && <h2 className="mb-2 text-lg font-semibold text-gray-900">{section.heading}</h2>}
            {section.paragraphs.map((paragraph, j) => (
              <p key={j} className="mb-2 text-sm leading-relaxed text-gray-700">{paragraph}</p>
            ))}
          </section>
        ))}

        <LegalFooter className="mt-12 border-t border-gray-200 pt-6" />
      </article>
    </div>
  );
}
