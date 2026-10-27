import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Globe, Heart, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import Stepper, { Step } from './Stepper';
import { markOnboardingDone } from '@/lib/onboarding';
import { useLanguage } from '@/i18n/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const TOUR_STEPS = ['welcome', 'choose', 'edit', 'preview', 'publish'] as const;
export type TourStep = (typeof TOUR_STEPS)[number];

type Rect = { top: number; left: number; width: number; height: number };

const MARGIN = 16; // from the viewport edges
const GAP = 16; // between the highlighted element and the card
const PAD = 6; // around the highlighted element

// The visible element marked data-tour="<key>" (the same key can exist in
// both the desktop and the hidden mobile layout).
function findTarget(key: string): Rect | null {
  for (const el of document.querySelectorAll<HTMLElement>(`[data-tour="${key}"]`)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return { top: r.top, left: r.left, width: r.width, height: r.height };
  }
  return null;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

// Puts the card beside the target where it fits: small targets (buttons)
// prefer below/above, large ones (panels) prefer the sides.
function placeCard(target: Rect | null, cardW: number, cardH: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const centered = { top: (vh - cardH) / 2, left: (vw - cardW) / 2 };
  if (!target) return centered;

  const t = { top: target.top - PAD, left: target.left - PAD, bottom: target.top + target.height + PAD, right: target.left + target.width + PAD };
  const midX = clamp((t.left + t.right) / 2 - cardW / 2, MARGIN, vw - cardW - MARGIN);
  const midY = clamp((t.top + t.bottom) / 2 - cardH / 2, MARGIN, vh - cardH - MARGIN);
  const sides = {
    below: { fits: t.bottom + GAP + cardH <= vh - MARGIN, pos: { top: t.bottom + GAP, left: midX } },
    above: { fits: t.top - GAP - cardH >= MARGIN, pos: { top: t.top - GAP - cardH, left: midX } },
    right: { fits: t.right + GAP + cardW <= vw - MARGIN, pos: { top: midY, left: t.right + GAP } },
    left: { fits: t.left - GAP - cardW >= MARGIN, pos: { top: midY, left: t.left - GAP - cardW } },
  };
  const order = target.height < 120 ? (['below', 'above', 'right', 'left'] as const) : (['right', 'left', 'below', 'above'] as const);
  const side = order.find((name) => sides[name].fits);
  return side ? sides[side].pos : centered;
}

function StepBody({ icon, heading, children }: { icon: ReactNode; heading: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center px-2 pb-1">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{heading}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{children}</p>
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Gets the dashboard ready for a step (switch tab, open the editor…) and returns the data-tour key to highlight. */
  onStep: (step: TourStep) => string | null;
}

export default function OnboardingTour({ open, onClose, onStep }: Props) {
  const { t } = useLanguage();
  const o = t.onboarding;
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(1);
  const [targetKey, setTargetKey] = useState<string | null>(null);
  const [target, setTarget] = useState<Rect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const close = () => {
    markOnboardingDone();
    onClose();
  };

  useEffect(() => {
    if (open) setIndex(1);
  }, [open]);

  useEffect(() => {
    if (open) setTargetKey(onStep(TOUR_STEPS[index - 1]));
    // onStep changes every render of the dashboard; only react to step changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  // Follow the target every frame: it can appear late (tab switch, editor
  // opening), move (resize, scroll) or change size, and so can the card.
  useEffect(() => {
    if (!open) return;
    let frame = 0;
    let last = '';
    const update = () => {
      const rect = targetKey ? findTarget(targetKey) : null;
      const card = cardRef.current;
      const pos = placeCard(rect, card?.offsetWidth ?? 440, card?.offsetHeight ?? 340);
      const key = JSON.stringify([rect, pos]);
      if (key !== last) {
        last = key;
        setTarget(rect);
        setCardPos(pos);
      }
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [open, targetKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const iconProps = { className: 'h-7 w-7', strokeWidth: 1.8 };
  const motion = 'all 400ms cubic-bezier(0.22, 1, 0.36, 1)';

  // Without a target the hole shrinks to nothing in the middle, so the whole page is dimmed
  const hole: CSSProperties = target
    ? { top: target.top - PAD, left: target.left - PAD, width: target.width + PAD * 2, height: target.height + PAD * 2 }
    : { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 };

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={o.welcome.heading} className="fixed inset-0 z-[100]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed rounded-2xl"
        style={{
          ...hole,
          boxShadow: `0 0 0 9999px rgba(17, 24, 39, 0.55)${target ? ', 0 0 0 3px #f43f5e, 0 0 24px 4px rgba(244, 63, 94, 0.45)' : ''}`,
          transition: motion,
        }}
      />

      <div
        ref={cardRef}
        className="fixed flex flex-col items-center gap-3"
        style={{
          width: `min(440px, calc(100vw - ${MARGIN * 2}px))`,
          top: cardPos?.top ?? '50%',
          left: cardPos?.left ?? '50%',
          visibility: cardPos ? 'visible' : 'hidden',
          transition: motion,
        }}
      >
        <Stepper
          theme="light"
          accentColor="#f43f5e"
          width="100%"
          style={{ '--stepper-frame': 'rgba(255, 255, 255, 0.97)' } as CSSProperties}
          step={index}
          onStepChange={setIndex}
          onFinalStepCompleted={close}
          backButtonText={o.back}
          nextButtonText={o.next}
          completeButtonText={o.start}
        >
          <Step title={o.welcome.title}>
            <StepBody icon={<Heart {...iconProps} />} heading={o.welcome.heading}>
              {o.welcome.body}
            </StepBody>
          </Step>
          <Step title={o.choose.title}>
            <StepBody icon={<LayoutGrid {...iconProps} />} heading={o.choose.heading}>
              {isMobile ? o.choose.bodyMobile : o.choose.body}
            </StepBody>
          </Step>
          <Step title={o.edit.title}>
            <StepBody icon={<SlidersHorizontal {...iconProps} />} heading={o.edit.heading}>
              {isMobile ? o.edit.bodyMobile : o.edit.body}
            </StepBody>
          </Step>
          <Step title={o.preview.title}>
            <StepBody icon={<Eye {...iconProps} />} heading={o.preview.heading}>
              {o.preview.body}
            </StepBody>
          </Step>
          <Step title={o.publish.title}>
            <StepBody icon={<Globe {...iconProps} />} heading={o.publish.heading}>
              {o.publish.body}
            </StepBody>
          </Step>
        </Stepper>
        <button onClick={close} className="text-xs font-medium text-white underline-offset-2 drop-shadow hover:underline">
          {o.skip}
        </button>
      </div>
    </div>,
    document.body
  );
}
