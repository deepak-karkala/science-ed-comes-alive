import { describe, it, expect } from 'vitest';
import { computeRBCColor, createRBCState, CIRCUIT_PHASES } from './rbcEngine';

describe('RBC Engine', () => {
  it('computes RBC color correctly ensuring it is never blue', () => {
    // Check low oxygen saturation (deoxygenated blood)
    const deoxygenatedColor = computeRBCColor(15);
    // Should be dark maroon, not blue
    expect(deoxygenatedColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    
    // Parse the rgb string to check components
    const match = deoxygenatedColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    const r = parseInt(match![1], 10);
    const g = parseInt(match![2], 10);
    const b = parseInt(match![3], 10);
    
    expect(r).toBeGreaterThan(b); // Red must be dominant
    expect(r).toBeGreaterThan(g);
    expect(b).toBe(g); // according to formula, they are equal
    
    // Check high oxygen saturation
    const oxygenatedColor = computeRBCColor(98);
    const matchOx = oxygenatedColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    expect(parseInt(matchOx![1], 10)).toBeGreaterThan(200); // Bright red
  });

  it('creates an RBC state with verified literal', () => {
    const state = createRBCState({
      position: 'lungs',
      o2Saturation: 98,
      heartRate: 80,
      distanceTraveled: 1.5,
      o2Delivered: 1000
    });
    
    expect(state.is_verified).toBe(true);
    expect(state.position).toBe('lungs');
    expect(state.co2Level).toBe(100 - 98); // inverse complement
    expect(state.color).toBe(computeRBCColor(98));
  });

  it('contains the correct circuit phases', () => {
    expect(CIRCUIT_PHASES.length).toBe(6);
    expect(CIRCUIT_PHASES[1].position).toBe('lungs');
  });
});
