import { useEffect, type ReactNode } from 'react';
import { Eye, Globe, Heart, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import Stepper, { Step } from './Stepper';
import { markOnboardingDone } from '@/lib/onboarding';
import { useLanguage } from '@/i18n/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

function StepBody({ icon, heading, children }: { icon: ReactNode; heading: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center px-2 pb-1">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{heading}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{children}</p>
    </div>
  );
}

export default function OnboardingTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const o = t.onboarding;
  const isMobile = useIsMobile();

  const close = () => {
    markOnboardingDone();
    onClose();
  };

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={o.welcome.heading}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-[440px] flex-col items-center gap-3">
        <Stepper
          theme="light"
          accentColor="#f43f5e"
          width={440}
          style={{ '--stepper-frame': 'rgba(255, 255, 255, 0.96)' } as React.CSSProperties}
          backButtonText={o.back}
          nextButtonText={o.next}
          completeButtonText={o.start}
          onFinalStepCompleted={close}
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
        <button onClick={close} className="text-xs font-medium text-white/90 underline-offset-2 hover:underline">
          {o.skip}
        </button>
      </div>
    </div>
  );
}
