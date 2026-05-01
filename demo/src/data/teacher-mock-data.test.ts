import { describe, expect, it } from 'vitest';
import { TEACHER_MOCK_STUDENTS } from './teacher-mock-data';

describe('teacher mock data', () => {
  it('contains a deterministic 30-student roster', () => {
    expect(TEACHER_MOCK_STUDENTS).toHaveLength(30);
    expect(TEACHER_MOCK_STUDENTS[0]).toMatchObject({
      id: 'student-1',
      name: 'Aarav',
      currentPhase: 'EXPERIMENT',
      activeMisconception: 'ELECTRICITY_STORED_MYTH',
    });
    expect(TEACHER_MOCK_STUDENTS[1]).toMatchObject({
      id: 'student-2',
      name: 'Priya',
      currentPhase: 'EXPLAIN',
    });
    expect(TEACHER_MOCK_STUDENTS[29]).toMatchObject({
      id: 'student-30',
      name: 'Myra',
    });
  });
});
