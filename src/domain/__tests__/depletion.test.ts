import { depletionLabel, mostDepletedArea } from '@/domain/depletion';

describe('depletion: mostDepletedArea', () => {
  it('picks the lowest scoring area', () => {
    expect(mostDepletedArea({ soul: 5, mind: 2, body: 4 })).toBe('mind');
    expect(mostDepletedArea({ soul: 1, mind: 5, body: 5 })).toBe('soul');
    expect(mostDepletedArea({ soul: 4, mind: 4, body: 2 })).toBe('body');
  });

  it('resolves ties in the humane order soul, then mind, then body', () => {
    expect(mostDepletedArea({ soul: 3, mind: 3, body: 5 })).toBe('soul');
    expect(mostDepletedArea({ soul: 5, mind: 3, body: 3 })).toBe('mind');
    expect(mostDepletedArea({ soul: 3, mind: 5, body: 3 })).toBe('soul');
  });

  it('handles all-equal scores', () => {
    expect(mostDepletedArea({ soul: 3, mind: 3, body: 3 })).toBe('soul');
  });
});

describe('depletion: depletionLabel', () => {
  it('maps scores to gentle, non-clinical labels', () => {
    expect(depletionLabel(1)).toBe('running low');
    expect(depletionLabel(2)).toBe('running low');
    expect(depletionLabel(3)).toBe('a little stretched');
    expect(depletionLabel(4)).toBe('fairly steady');
    expect(depletionLabel(5)).toBe('fairly steady');
  });
});
