// One JSON line per security-relevant event. Never pass emails, tokens,
// IP addresses or request bodies here.
export function logEvent(event, fields = {}) {
  console.log(JSON.stringify({ time: new Date().toISOString(), event, ...fields }));
}
