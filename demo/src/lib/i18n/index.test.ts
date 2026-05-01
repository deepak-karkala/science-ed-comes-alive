import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { getTranslation } from './index';
import { useTranslations } from './index';

describe('i18n dictionary', () => {
  it('returns english string for "en" language', () => {
    expect(getTranslation('common.start', 'en')).toBe('Start Lesson');
  });

  it('returns hindi string for "hi" language', () => {
    expect(getTranslation('common.start', 'hi')).toBe('पाठ शुरू करें');
  });

  it('falls back to english if hindi translation is missing', () => {
    expect(getTranslation('common.test_missing_key_in_hi', 'hi')).toBe('Missing Hindi');
  });

  it('returns the key itself if missing in english entirely', () => {
    // @ts-expect-error - testing invalid key
    expect(getTranslation('invalid.key', 'en')).toBe('invalid.key');
  });

  it('exposes a translation hook with the same fallback behavior', () => {
    const { result } = renderHook(() => useTranslations('hi'));
    expect(result.current.t('common.start')).toBe('पाठ शुरू करें');
    expect(result.current.t('common.test_missing_key_in_hi')).toBe('Missing Hindi');
  });
});
