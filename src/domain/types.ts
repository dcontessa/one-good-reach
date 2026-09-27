/**
 * Core domain types for One Good Reach.
 * These are storage and UI agnostic. Services and screens depend on these.
 */

export type CheckInArea = 'soul' | 'mind' | 'body';

export type ActionIntent = 'gratitude' | 'check_in' | 'invitation' | 'support' | 'repair';

export interface Person {
  id: string;
  label: string;
  relationship?: string;
  createdAt: string;
}

export interface CheckInRatings {
  soul: number;
  mind: number;
  body: number;
}

export interface CheckIn {
  id: string;
  createdAt: string;
  soul: number;
  mind: number;
  body: number;
  note: string;
  depletedArea: CheckInArea;
  safetyFlagged: boolean;
}

export interface Action {
  id: string;
  checkInId: string;
  intent: ActionIntent;
  personId: string | null;
  title: string;
  rationale: string;
  suggestedMessage: string;
  premium: boolean;
  createdAt: string;
}

export interface Completion {
  id: string;
  actionId: string;
  completedAt: string;
  reflection: string;
  feltBetter: boolean | null;
}

export type SafetyCategory = 'self_harm' | 'harm_others' | 'none';

export interface SafetyResult {
  flagged: boolean;
  category: SafetyCategory;
}
