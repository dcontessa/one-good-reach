import { scanForCrisis, shouldRouteToSafety } from '@/domain/safety';

describe('safety: crisis detection', () => {
  it('does not flag empty or whitespace input', () => {
    expect(scanForCrisis('').flagged).toBe(false);
    expect(scanForCrisis('   \n  ').flagged).toBe(false);
    expect(shouldRouteToSafety('')).toBe(false);
  });

  it('does not flag ordinary relationship notes', () => {
    const notes = [
      'I feel a bit lonely and want to text my sister.',
      'Work has been stressful, I miss my friends.',
      'I am tired but grateful for my partner.',
      'I killed it at the presentation today.',
      'This deadline is killing me but I will manage.',
    ];
    for (const n of notes) {
      expect(scanForCrisis(n).flagged).toBe(false);
    }
  });

  it('flags clear self-harm and suicidal language', () => {
    const notes = [
      'I want to die',
      'I keep thinking about killing myself',
      'I feel like there is no reason to live',
      'honestly I wish I was dead',
      'I have been thinking about suicide',
      'I want to hurt myself tonight',
    ];
    for (const n of notes) {
      const result = scanForCrisis(n);
      expect(result.flagged).toBe(true);
      expect(result.category).toBe('self_harm');
    }
  });

  it('flags language about harming others', () => {
    const result = scanForCrisis('I want to hurt them so badly');
    expect(result.flagged).toBe(true);
    expect(result.category).toBe('harm_others');
  });

  it('softens obvious negations', () => {
    expect(scanForCrisis('I do not want to die, I want to feel better').flagged).toBe(false);
    expect(scanForCrisis('I would never hurt myself').flagged).toBe(false);
  });

  it('softens clearly resolved or past framing', () => {
    expect(scanForCrisis('I used to want to die but I am better now').flagged).toBe(false);
    expect(scanForCrisis('Years ago I thought about suicide, not anymore').flagged).toBe(false);
  });

  it('is case insensitive', () => {
    expect(scanForCrisis('I WANT TO DIE').flagged).toBe(true);
  });

  it('flags when a crisis sentence is mixed with normal text', () => {
    const note = 'Had a nice coffee this morning. But lately I want to kill myself.';
    expect(scanForCrisis(note).flagged).toBe(true);
  });
});
