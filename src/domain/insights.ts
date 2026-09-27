import type { Action, ActionIntent, CheckIn, CheckInArea, Completion, Person } from './types';

export interface PatternInsights {
  totalCheckIns: number;
  completedActions: number;
  mostDepletedArea: CheckInArea | null;
  topIntent: ActionIntent | null;
  reachedPeople: { person: Person; count: number }[];
}

function mode<T extends string>(values: T[]): T | null {
  if (values.length === 0) return null;
  const counts = new Map<T, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: T | null = null;
  let bestCount = -1;
  for (const [v, c] of counts) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return best;
}

/**
 * Compute lightweight, private pattern insights from history. Deeper insights
 * (trends over time, relationship-specific plans) are layered on top for
 * premium in a later milestone, but the basic view is always free.
 */
export function computeInsights(
  checkIns: CheckIn[],
  actions: Action[],
  completions: Completion[],
  persons: Person[],
): PatternInsights {
  const completedActionIds = new Set(completions.map((c) => c.actionId));

  const reachCounts = new Map<string, number>();
  for (const action of actions) {
    if (action.personId && completedActionIds.has(action.id)) {
      reachCounts.set(action.personId, (reachCounts.get(action.personId) ?? 0) + 1);
    }
  }

  const reachedPeople = persons
    .map((person) => ({ person, count: reachCounts.get(person.id) ?? 0 }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    totalCheckIns: checkIns.length,
    completedActions: completions.length,
    mostDepletedArea: mode(checkIns.map((c) => c.depletedArea)),
    topIntent: mode(actions.map((a) => a.intent)),
    reachedPeople,
  };
}
