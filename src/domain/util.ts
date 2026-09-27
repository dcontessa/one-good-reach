/**
 * Small pure utilities. Kept dependency-free so domain and tests stay light.
 */

/** RFC4122-ish v4 id. Good enough for local records; not security sensitive. */
export function createId(): string {
  const hex = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) out += '-';
    if (i === 12) {
      out += '4';
    } else if (i === 16) {
      out += hex[(Math.floor(Math.random() * 4) + 8)];
    } else {
      out += hex[Math.floor(Math.random() * 16)];
    }
  }
  return out;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** True if the two ISO timestamps fall on the same calendar day (local time). */
export function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
