import { describe, it, expect } from 'vitest';
import { computePHMix, Drops } from './phEngine';

describe('pH Engine', () => {
  it('computes pH of a single substance correctly', () => {
    const drops: Drops = { lemon_juice: 1 };
    const result = computePHMix(drops);
    expect(result.is_verified).toBe(true);
    expect(result.ph).toBe(2.5);
  });

  it('computes weighted average pH for mixed substances', () => {
    // lemon_juice (2.5) * 1 + antacid (9.5) * 1 = (2.5 + 9.5) / 2 = 6.0
    const drops: Drops = { lemon_juice: 1, antacid: 1 };
    const result = computePHMix(drops);
    expect(result.ph).toBe(6.0);
  });

  it('returns neutral pH 7.0 when there are no drops', () => {
    const drops: Drops = {};
    const result = computePHMix(drops);
    expect(result.ph).toBe(7.0);
  });

  it('returns the exact predefined color if only one substance is present', () => {
    // 5.5 soda water -> #CCEE44
    expect(computePHMix({ soda_water: 1 }).color).toBe('#CCEE44');
    // 2.5 lemon juice -> #FF4444
    expect(computePHMix({ lemon_juice: 3 }).color).toBe('#FF4444');
  });

  it('calculates an interpolated color for mixtures based on pH', () => {
    // Mix resulting in ~6.0
    const mixColor = computePHMix({ lemon_juice: 1, antacid: 1 }).color;
    expect(mixColor).toMatch(/^#[0-9A-F]{6}$/i);
    // 6.0 should be a yellowish-green, not the default green #00FF00
    expect(mixColor).not.toBe('#00FF00');
    expect(mixColor).not.toBe('#FF0000');
  });
});
