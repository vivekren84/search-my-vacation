export const callbackTimeWindows = [
  "10:00 AM–1:00 PM",
  "1:00 PM–4:00 PM",
  "4:00 PM–7:00 PM",
] as const;

export function currentLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function callbackDateValidationMessage(value: string, today = currentLocalDate()) {
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < today) {
    return "Please choose today or a future date for your callback preference.";
  }

  const day = new Date(`${value}T00:00:00`).getDay();
  return day === 0
    ? "Search My Vacation is unavailable on Sundays. Please choose Monday to Saturday."
    : "";
}

export function isValidCallbackDate(value: string, today = currentLocalDate()) {
  return Boolean(value) && !callbackDateValidationMessage(value, today);
}

export function isCallbackTimeWindow(value: string): value is (typeof callbackTimeWindows)[number] {
  return callbackTimeWindows.includes(value as (typeof callbackTimeWindows)[number]);
}
