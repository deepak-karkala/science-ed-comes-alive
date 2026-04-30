import { describe, it, expect } from 'vitest';
import { computeEMF } from './emInductionEngine';

describe('EM Induction Engine', () => {
  it('computes EMF properly for a stationary wire', () => {
    const result = computeEMF(0, 1.0);
    expect(result.is_verified).toBe(true);
    expect(result.emf).toBe(0);
    expect(result.current).toBe(0);
    expect(result.bulbBrightness).toBe(0);
  });

  it('computes EMF for a moving wire in a magnetic field', () => {
    // EMF = B * L * v
    // B = 0.5 T, L = 0.5 m, v = 2 m/s -> EMF = 0.5 * 0.5 * 2 = 0.5 V
    // Current = EMF / R = 0.5 / 10 = 0.05 A
    const result = computeEMF(2, 0.5);
    expect(result.is_verified).toBe(true);
    expect(result.emf).toBe(0.5);
    expect(result.current).toBe(0.05);
    expect(result.bulbBrightness).toBe(Math.min(1, 0.05 * 5));
    expect(result.electronDensity).toBe(Math.min(1, 0.05 * 8));
  });

  it('handles negative velocity (opposite direction) properly by using absolute velocity for EMF', () => {
    const result = computeEMF(-2, 0.5);
    expect(result.emf).toBe(0.5); // EMF is proportional to magnitude
  });

  it('caps bulbBrightness and electronDensity at 1', () => {
    // High velocity to max out the values
    const result = computeEMF(100, 1.0);
    expect(result.bulbBrightness).toBe(1);
    expect(result.electronDensity).toBe(1);
  });
});
