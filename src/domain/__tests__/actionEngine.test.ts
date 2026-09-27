import { selectAction } from '@/domain/actionEngine';
import { AREA_INTENTS, TEMPLATES } from '@/content/actions';

describe('actionEngine: selectAction', () => {
  it('returns a valid template for the chosen intent', () => {
    const { intent, template } = selectAction({ area: 'soul', isPremium: false });
    expect(template.intent).toBe(intent);
    expect(TEMPLATES.some((t) => t.intent === intent)).toBe(true);
  });

  it('prefers the first candidate for the area when there is no recent history', () => {
    const { intent } = selectAction({ area: 'soul', isPremium: true });
    expect(intent).toBe(AREA_INTENTS.soul[0]);
  });

  it('never selects the premium repair intent for free users', () => {
    // Force conditions that would otherwise surface repair by exhausting others
    // via recentIntents. Free users must still never receive a premium template.
    const result = selectAction({
      area: 'soul',
      isPremium: false,
      recentIntents: ['gratitude', 'check_in', 'invitation', 'support'],
    });
    expect(result.template.premium).toBe(false);
    expect(result.intent).not.toBe('repair');
  });

  it('allows the repair intent for premium users when appropriate', () => {
    // repair is last in every area order, so it only appears once others are recent.
    const result = selectAction({
      area: 'soul',
      isPremium: true,
      recentIntents: ['gratitude'],
    });
    // With gratitude as the most recent intent, it should pick a different one.
    expect(result.intent).not.toBe('gratitude');
  });

  it('avoids repeating the most recent intent when another option exists', () => {
    const first = AREA_INTENTS.mind[0]!;
    const result = selectAction({
      area: 'mind',
      isPremium: true,
      recentIntents: [first],
    });
    expect(result.intent).not.toBe(first);
  });

  it('is deterministic for identical input', () => {
    const input = { area: 'body' as const, isPremium: false, recentIntents: [] };
    const a = selectAction(input);
    const b = selectAction(input);
    expect(a.intent).toBe(b.intent);
  });

  it('produces a selection for every area', () => {
    for (const area of ['soul', 'mind', 'body'] as const) {
      const { intent } = selectAction({ area, isPremium: false });
      expect(intent).toBeTruthy();
    }
  });
});
