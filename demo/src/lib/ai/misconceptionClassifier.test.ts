import { describe, expect, it } from 'vitest';
import { classifyMisconception } from './misconceptionClassifier';

describe('misconceptionClassifier', () => {
  it('identifies ELECTRICITY_STORED_MYTH from physics keywords', () => {
    const result = classifyMisconception('The wire already has electricity stored inside it that just gets released', 'physics');
    expect(result).not.toBeNull();
    expect(result!.tag).toBe('ELECTRICITY_STORED_MYTH');
    expect(result!.confidence).toBeGreaterThan(0.7);
  });

  it('identifies ELECTRICITY_STORED_MYTH from "battery" keyword (demo plan spec)', () => {
    const result = classifyMisconception('I think the battery stores electricity inside', 'physics');
    expect(result).not.toBeNull();
    expect(result!.tag).toBe('ELECTRICITY_STORED_MYTH');
    expect(result!.confidence).toBeGreaterThan(0.7);
  });

  it('identifies MAGNET_AS_SOURCE_MYTH from physics keywords', () => {
    const result = classifyMisconception('The magnet gives its energy to the bulb', 'physics');
    expect(result).not.toBeNull();
    expect(result!.tag).toBe('MAGNET_AS_SOURCE_MYTH');
    expect(result!.confidence).toBeGreaterThan(0.7);
  });

  it('identifies BLOOD_COLOR_MYTH from biology keywords', () => {
    const result = classifyMisconception('Deoxygenated blood is blue until it hits oxygen', 'biology');
    expect(result).not.toBeNull();
    expect(result!.tag).toBe('BLOOD_COLOR_MYTH');
    expect(result!.confidence).toBeGreaterThan(0.7);
  });

  it('identifies CIRCULATORY_ISOLATION_MYTH from biology keywords', () => {
    const result = classifyMisconception('The blood just stays in the heart', 'biology');
    expect(result).not.toBeNull();
    expect(result!.tag).toBe('CIRCULATORY_ISOLATION_MYTH');
    expect(result!.confidence).toBeGreaterThan(0.7);
  });

  it('returns null for unknown text without throwing', () => {
    const result = classifyMisconception('I think the magnet pushes the electrons', 'physics');
    expect(result).toBeNull();
  });

  it('returns null for empty strings', () => {
    const result = classifyMisconception('', 'physics');
    expect(result).toBeNull();
  });
});
