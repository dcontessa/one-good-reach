import type { ActionIntent, CheckInArea } from '@/domain/types';

/**
 * Static action templates. The mock AiService fills these locally. A future
 * server AiService can return richer, personalized variants for premium users.
 * All copy is warm, plain, adult, and free of em dashes.
 */

export interface ActionTemplate {
  intent: ActionIntent;
  title: string;
  rationale: string;
  /** {name} is replaced with the chosen person label, or a gentle fallback. */
  messageTemplate: string;
  /** Marks templates that only unlock for premium (deeper or harder work). */
  premium: boolean;
}

export const INTENT_LABELS: Record<ActionIntent, string> = {
  gratitude: 'Share gratitude',
  check_in: 'Check in on someone',
  invitation: 'Make an invitation',
  support: 'Ask for support',
  repair: 'Prepare a repair',
};

/**
 * Which intents tend to help each depleted area. Order matters: earlier is
 * preferred. Repair is intentionally last and gated for premium since it is the
 * most demanding.
 */
export const AREA_INTENTS: Record<CheckInArea, ActionIntent[]> = {
  soul: ['gratitude', 'check_in', 'invitation', 'support', 'repair'],
  mind: ['support', 'check_in', 'gratitude', 'invitation', 'repair'],
  body: ['invitation', 'check_in', 'gratitude', 'support', 'repair'],
};

export const TEMPLATES: ActionTemplate[] = [
  {
    intent: 'gratitude',
    title: 'Tell someone what they mean to you',
    rationale:
      'Naming gratitude to a real person is a small act that tends to lift the spirit and remind you that you are held.',
    messageTemplate:
      'Hi {name}, you crossed my mind today and I wanted you to know I am grateful for you. Thank you for being part of my life.',
    premium: false,
  },
  {
    intent: 'check_in',
    title: 'Send a gentle check-in',
    rationale:
      'A short, no-pressure message keeps a thread of connection alive and often means more than we expect.',
    messageTemplate:
      'Hi {name}, no need to reply quickly. I was thinking of you and wanted to see how you are doing lately.',
    premium: false,
  },
  {
    intent: 'invitation',
    title: 'Invite someone to something small',
    rationale:
      'A light invitation creates a real moment together and gives your week something to look forward to.',
    messageTemplate:
      'Hi {name}, would you be up for a short walk or a coffee sometime this week? No pressure on timing, I would just love to see you.',
    premium: false,
  },
  {
    intent: 'support',
    title: 'Ask one person for a little support',
    rationale:
      'Letting someone in when your mind feels stretched shares the load and deepens trust. Asking is a strength.',
    messageTemplate:
      'Hi {name}, I have had a lot on my mind and could use a friendly ear. Would you have a little time to talk this week?',
    premium: false,
  },
  {
    intent: 'repair',
    title: 'Prepare a gentle repair',
    rationale:
      'When something has felt off with someone who matters, preparing a calm, honest opening can reopen the door.',
    messageTemplate:
      'Hi {name}, I have been thinking about us and I value our relationship. When you have a moment, I would like to talk openly and listen.',
    premium: true,
  },
];

export const PERSON_FALLBACK = 'someone who matters to you';
