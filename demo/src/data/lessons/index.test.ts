import { describe, it, expect } from 'vitest';
import { LESSONS } from './index';

describe('Lesson Data', () => {
  it('contains exactly 3 demo lessons', () => {
    expect(LESSONS.length).toBe(3);
  });
  
  it('lessons have correct subjects', () => {
    const subjects = LESSONS.map(l => l.subject).sort();
    expect(subjects).toEqual(['biology', 'chemistry', 'physics']);
  });
  
  it('lessons have all required LessonConfig fields', () => {
    for (const lesson of LESSONS) {
      expect(lesson.id).toBeTruthy();
      expect(typeof lesson.title).toBe('string');
      expect(lesson.ncertReference).toBeTruthy();
      expect(lesson.misconceptionTargets.length).toBeGreaterThan(0);
      expect(lesson.applyPrompt).toBeTruthy();
      expect(lesson.summaryCopy.concepts.length).toBeGreaterThan(0);
      expect(lesson.summaryCopy.dinnerTableQuestion).toBeTruthy();
      expect(lesson.summaryCopy.nextLessonPreview).toBeTruthy();
    }
  });
});
