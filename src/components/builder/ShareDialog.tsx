import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '../../i18n/LanguageContext';
import SharePanel from './SharePanel';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  slug: string;
}

export default function ShareDialog({ open, onOpenChange, url, slug }: Props) {
  const s = useLanguage().t.share;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{s.title}</DialogTitle>
          <DialogDescription>{s.description}</DialogDescription>
        </DialogHeader>
        <SharePanel url={url} slug={slug} />
      </DialogContent>
    </Dialog>
  );
}
