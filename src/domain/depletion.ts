import type { CheckInArea, CheckInRatings } from './types';

/**
 * Determine which area feels most depleted from a check-in.
 * Lower score means more depleted. Ties resolve in a stable, humane order that
 * favors the more internal areas first (soul, then mind, then body), because
 * relational reconnection tends to help those most directly.
 */
const TIE_ORDER: CheckInArea[] = ['soul', 'mind', 'body'];

export function mostDepletedArea(ratings: CheckInRatings): CheckInArea {
  const entries: { area: CheckInArea; score: number }[] = [
    { area: 'soul', score: ratings.soul },
    { area: 'mind', score: ratings.mind },
    { area: 'body', score: ratings.body },
  ];

  let lowest = entries[0]!;
  for (const entry of entries) {
    if (entry.score < lowest.score) {
      lowest = entry;
    } else if (entry.score === lowest.score) {
      // Keep the one earlier in the humane tie order.
      if (TIE_ORDER.indexOf(entry.area) < TIE_ORDER.indexOf(lowest.area)) {
        lowest = entry;
      }
    }
  }
  return lowest.area;
}

/**
 * A gentle qualitative label for how depleted a score feels. Not clinical.
 */
export function depletionLabel(score: number): string {
  if (score <= 2) return 'running low';
  if (score === 3) return 'a little stretched';
  return 'fairly steady';
}
