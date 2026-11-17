// Today's date as YYYY-MM-DD in the user's local time zone.
// (toISOString() uses UTC, which is still "yesterday" early in the morning in Sri Lanka.)
export const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** True when a YYYY-MM-DD date is before today. */
export const isPastDate = (value) => !!value && value < todayISO();
