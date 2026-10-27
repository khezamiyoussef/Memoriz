import { supabase } from "@/lib/supabase";

// Stored on the Supabase user, so the tour isn't shown again on another device
const DONE_KEY = "onboarding_done";

/** First visit: no site yet and the tour was never finished or skipped. */
export async function shouldShowOnboarding(hasSite: boolean): Promise<boolean> {
  if (hasSite) return false;
  const { data } = await supabase.auth.getSession();
  return !data.session?.user.user_metadata?.[DONE_KEY];
}

export function markOnboardingDone() {
  supabase.auth.updateUser({ data: { [DONE_KEY]: true } }).catch(() => {
    // Worst case the tour shows once more
  });
}
