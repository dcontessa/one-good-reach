import { AREA_INTENTS, TEMPLATES, type ActionTemplate } from '@/content/actions';
import type { ActionIntent, CheckInArea } from './types';

export interface ActionSelectionInput {
  area: CheckInArea;
  /** Intents used in recent actions, most recent first. Used to add variety. */
  recentIntents?: ActionIntent[];
  /** Whether the user has premium entitlement. Gates the harder repair work. */
  isPremium: boolean;
}

export interface ActionSelection {
  intent: ActionIntent;
  template: ActionTemplate;
}

function templateFor(intent: ActionIntent): ActionTemplate {
  const t = TEMPLATES.find((x) => x.intent === intent);
  if (!t) {
    throw new Error(`No template for intent ${intent}`);
  }
  return t;
}

/**
 * Choose the single best action intent for this check-in.
 *
 * Rules:
 * - Candidate intents come from the depleted area's ordered preference list.
 * - Premium-only intents (repair) are filtered out for free users.
 * - Avoid repeating the most recent intent when another good option exists,
 *   so the daily ritual stays varied. This is deterministic, not random, so it
 *   is easy to test.
 */
export function selectAction(input: ActionSelectionInput): ActionSelection {
  const { area, recentIntents = [], isPremium } = input;

  const candidates = AREA_INTENTS[area].filter((intent) => {
    const template = templateFor(intent);
    return isPremium || !template.premium;
  });

  // Safety net: candidates always contains at least the free intents.
  const lastIntent = recentIntents[0];
  const preferred =
    candidates.find((intent) => intent !== lastIntent) ?? candidates[0];

  if (!preferred) {
    // Should never happen because free templates always exist, but keep it safe.
    const fallback = templateFor('check_in');
    return { intent: 'check_in', template: fallback };
  }

  return { intent: preferred, template: templateFor(preferred) };
}
