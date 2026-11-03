const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(val: number | string): string {
  return val
    .toString()
    .replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function formatSecondsToTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "০০:০০";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;

  return toBengaliNumber(`${minsStr}:${secsStr}`);
}

