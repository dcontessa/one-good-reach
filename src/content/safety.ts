/**
 * Supportive safety content. Presented as information, not advice or diagnosis.
 * Availability of helplines varies by country. This is never behind the paywall.
 */

export interface Helpline {
  region: string;
  name: string;
  contact: string;
  note?: string;
}

export const SAFETY_INTRO =
  'It sounds like you are carrying something heavy right now. You deserve real support, and you do not have to hold this alone.';

export const SAFETY_IMMEDIATE =
  'If you might be in immediate danger, please contact your local emergency services now.';

export const SAFETY_REACH_OUT =
  'Reaching one trusted person, a friend, family member, or a professional, can help. You can also contact a helpline below. They are there to listen.';

export const SAFETY_DISCLAIMER =
  'One Good Reach is not a crisis service and does not provide therapy or diagnosis. The information here is a starting point for finding real support.';

/**
 * A short, widely recognized set. Localized and expanded in a later milestone.
 * Presented with a clear note that availability varies by country.
 */
export const HELPLINES: Helpline[] = [
  {
    region: 'United States and Canada',
    name: '988 Suicide and Crisis Lifeline',
    contact: 'Call or text 988',
  },
  {
    region: 'United Kingdom and Ireland',
    name: 'Samaritans',
    contact: 'Call 116 123',
  },
  {
    region: 'Australia',
    name: 'Lifeline',
    contact: 'Call 13 11 14',
  },
  {
    region: 'International',
    name: 'Find a Helpline',
    contact: 'Visit findahelpline.com',
    note: 'A directory of free, confidential support lines in many countries.',
  },
];
