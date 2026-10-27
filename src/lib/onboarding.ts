// The tour opens once per visit: sessionStorage lasts until the tab or
// browser is closed, so a refresh doesn't bring it back but the next visit does.
const SEEN_KEY = "memoriz_onboarding_seen";

export function shouldShowOnboarding(): boolean {
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
}

export function markOnboardingDone() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable (e.g. private mode): the tour may show again on refresh
  }
}
