import { CanvasItem } from "../../types/builder";

import PreviewHero from "./PreviewHero";
import PreviewLoveLetter from "./PreviewLoveLetter";
import PreviewFlipCards from "./PreviewFlipCards";
import PreviewPhotoGallery from "./PreviewPhotoGallery";
import PreviewCarousel from "./PreviewCarousel";
import PreviewTimeline from "./PreviewTimeline";
import PreviewMakeAWish from "./PreviewMakeAWish";
import PreviewFinalMessage from "./PreviewFinalMessage";
import PreviewNameDisplay from "./PreviewNameDisplay";
import PreviewFloatingDecoration from "./PreviewFloatingDecoration";
import PreviewSurprises from "./PreviewSurprises";
import PreviewPlaylist from "./PreviewPlaylist";
import PreviewPromiseJar from "./PreviewPromiseJar";

function renderSection(item: CanvasItem, isPreview: boolean) {
  const { templateId, values } = item;

  switch (templateId) {
    case "hero":               return <PreviewHero values={values} />;
    case "love-letter":        return <PreviewLoveLetter values={values} />;
    case "flip-cards":         return <PreviewFlipCards values={values} />;
    case "photo-gallery":      return <PreviewPhotoGallery values={values} />;
    case "carousel":           return <PreviewCarousel values={values} />;
    case "timeline":           return <PreviewTimeline values={values} />;
    case "make-a-wish":        return <PreviewMakeAWish values={values} />;
    case "final-message":      return <PreviewFinalMessage values={values} />;
    case "name-display":       return <PreviewNameDisplay values={values} />;
    case "floating-decoration":return <PreviewFloatingDecoration values={values} />;
    case "surprises":          return <PreviewSurprises values={values} />;
    case "love-playlist":      return <PreviewPlaylist values={values} isPreview={isPreview} />;
    case "promise-jar":        return <PreviewPromiseJar values={values} />;
    default:                   return null;
  }
}

// The full-size site, used by both the dashboard preview and published pages.
// `isPreview` shows hints meant for the site's creator, never for visitors.
export default function SiteSections({ items, isPreview = false }: { items: CanvasItem[]; isPreview?: boolean }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.instanceId}>{renderSection(item, isPreview)}</div>
      ))}
    </div>
  );
}
