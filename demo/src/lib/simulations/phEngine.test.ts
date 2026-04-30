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

  it('calculates the correct color based on pH', () => {
    // 1-3 deep red
    expect(computePHMix({ lemon_juice: 1 }).color).toBe('#FF0000'); // Let's say we use deep red for low pH
    
    // 7 green
    expect(computePHMix({}).color).toBe('#00FF00'); // neutral green
    
    // 9-14 violet
    expect(computePHMix({ antacid: 10 }).color).toBe('#8A2BE2'); // violet
  });
});
