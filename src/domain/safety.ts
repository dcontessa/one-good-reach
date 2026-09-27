import type { SafetyCategory, SafetyResult } from './types';

/**
 * Local, synchronous crisis-language detection.
 *
 * This is a supportive routing nudge, not a clinical screening tool. It runs
 * before any action is generated or any network request is made. When it flags,
 * the app shows a supportive safety screen and does not generate a normal
 * relationship action.
 *
 * Design goals:
 * - Conservative: high-signal phrases, not single ambiguous words.
 * - Reduce obvious false positives via negation ("i don't want to hurt myself")
 *   and clearly past/resolved framing ("i used to want to die, but I'm better now").
 * - Never diagnose. Only route.
 */

interface Phrase {
  pattern: RegExp;
  category: Exclude<SafetyCategory, 'none'>;
}

// High-signal phrases. Word-boundary anchored where sensible.
const PHRASES: Phrase[] = [
  // Self harm / suicidal ideation
  { pattern: /\bkill(ing)?\s+myself\b/, category: 'self_harm' },
  { pattern: /\bend(ing)?\s+(my|it)\s+(life|all)\b/, category: 'self_harm' },
  { pattern: /\btake\s+my\s+(own\s+)?life\b/, category: 'self_harm' },
  { pattern: /\bwant\s+to\s+die\b/, category: 'self_harm' },
  { pattern: /\bwish\s+i\s+(was|were)\s+dead\b/, category: 'self_harm' },
  { pattern: /\bdon'?t\s+want\s+to\s+(be\s+here|live|exist)\b/, category: 'self_harm' },
  { pattern: /\bhurt(ing)?\s+myself\b/, category: 'self_harm' },
  { pattern: /\bharm(ing)?\s+myself\b/, category: 'self_harm' },
  { pattern: /\bself[-\s]?harm\b/, category: 'self_harm' },
  { pattern: /\bcut(ting)?\s+myself\b/, category: 'self_harm' },
  { pattern: /\bsuicid(e|al)\b/, category: 'self_harm' },
  { pattern: /\bno\s+reason\s+to\s+(live|go\s+on)\b/, category: 'self_harm' },
  { pattern: /\bbetter\s+off\s+dead\b/, category: 'self_harm' },
  { pattern: /\boverdose\b/, category: 'self_harm' },

  // Harm to others
  { pattern: /\bkill(ing)?\s+(him|her|them|someone|everyone|people)\b/, category: 'harm_others' },
  { pattern: /\bhurt(ing)?\s+(him|her|them|someone|people)\b/, category: 'harm_others' },
  { pattern: /\bmake\s+(them|him|her)\s+pay\b/, category: 'harm_others' },
];

// Negation cues that appear immediately before a phrase, e.g. "i do not want to die".
const NEGATION = /(^|\b)(never|not|no|don'?t|do\s+not|didn'?t|did\s+not|won'?t|will\s+not|would\s+never|can'?t\s+imagine)\b[^.!?]{0,24}$/;

// Clearly resolved / past framing anywhere in the sentence.
const RESOLVED = /\b(used\s+to|in\s+the\s+past|years?\s+ago|but\s+(i'?m|i\s+am)\s+(okay|ok|better|fine|good)|no\s+longer|not\s+anymore)\b/;

function splitSentences(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Scan free text for crisis language. Returns the first matched category.
 * Empty or whitespace input is never flagged.
 */
export function scanForCrisis(rawText: string): SafetyResult {
  const text = (rawText ?? '').trim();
  if (!text) return { flagged: false, category: 'none' };

  for (const sentence of splitSentences(text)) {
    for (const { pattern, category } of PHRASES) {
      const match = pattern.exec(sentence);
      if (!match) continue;

      const before = sentence.slice(0, match.index);
      // Skip if negated right before the phrase.
      if (NEGATION.test(before)) continue;
      // Skip if the sentence frames it as clearly resolved or in the past.
      if (RESOLVED.test(sentence)) continue;

      return { flagged: true, category };
    }
  }

  return { flagged: false, category: 'none' };
}

/**
 * Hard gate used by the action pipeline. If this returns true, the app must
 * route to the safety screen and must not generate a normal action.
 */
export function shouldRouteToSafety(rawText: string): boolean {
  return scanForCrisis(rawText).flagged;
}
