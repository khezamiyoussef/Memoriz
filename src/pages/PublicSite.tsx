import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import SiteSections from "@/components/preview/SiteSections";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { getPublishedSite, PublishedSite } from "@/lib/sites";
import NotFound from "./NotFound";

// A published site, served at /<slug>.
export default function PublicSite() {
  const { slug = "" } = useParams();
  // undefined = loading, null = no published site at this URL
  const [site, setSite] = useState<PublishedSite | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setSite(undefined);
    getPublishedSite(slug.toLowerCase())
      .then((result) => { if (!cancelled) setSite(result); })
      .catch(() => { if (!cancelled) setSite(null); });
    return () => { cancelled = true; };
  }, [slug]);

  if (site === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
      </div>
    );
  }

  if (!site) return <NotFound />;

  return (
    <LanguageProvider fixedLang={site.lang}>
      <main className="min-h-screen bg-background">
        <SiteSections items={site.content} />
      </main>
    </LanguageProvider>
  );
}
