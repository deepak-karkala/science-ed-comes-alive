import { MisconceptionTag } from '../lib/types/misconception';

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'online' | 'offline';
  currentPhase: 'PREDICT' | 'EXPERIMENT' | 'OBSERVE' | 'EXPLAIN' | 'APPLY';
  activeMisconception?: MisconceptionTag;
}

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vivaan', 'Diya', 'Aditya', 'Sneha',
  'Arjun', 'Neha', 'Sai', 'Kavya', 'Reyansh', 'Ishita', 'Ayaan', 'Riya',
  'Krishna', 'Anushka', 'Ishaan', 'Meera', 'Dhruv', 'Sanya', 'Kabir', 'Tara',
  'Shaurya', 'Nisha', 'Atharv', 'Kiara', 'Aarush', 'Myra'
];

const STATUS_PATTERN: Student['status'][] = ['online', 'online', 'offline', 'online', 'online'];
const PHASE_PATTERN: Student['currentPhase'][] = ['PREDICT', 'EXPERIMENT', 'OBSERVE', 'EXPLAIN', 'APPLY'];
const MISCONCEPTION_PATTERN: Array<Student['activeMisconception']> = [
  'ELECTRICITY_STORED_MYTH',
  undefined,
  undefined,
  'MAGNET_AS_SOURCE_MYTH',
  undefined,
  'BLOOD_COLOR_MYTH',
];

export const TEACHER_MOCK_STUDENTS: Student[] = Array.from({ length: 30 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: FIRST_NAMES[i] || `Student ${i + 1}`,
  avatarUrl: `https://i.pravatar.cc/150?u=student${i}`,
  status: STATUS_PATTERN[i % STATUS_PATTERN.length],
  currentPhase: PHASE_PATTERN[i % PHASE_PATTERN.length],
  activeMisconception: MISCONCEPTION_PATTERN[i % MISCONCEPTION_PATTERN.length],
}));

TEACHER_MOCK_STUDENTS[0] = { ...TEACHER_MOCK_STUDENTS[0], name: 'Aarav', currentPhase: 'EXPERIMENT', activeMisconception: 'ELECTRICITY_STORED_MYTH' };
TEACHER_MOCK_STUDENTS[1] = { ...TEACHER_MOCK_STUDENTS[1], name: 'Priya', currentPhase: 'EXPLAIN', activeMisconception: undefined };
TEACHER_MOCK_STUDENTS[2] = { ...TEACHER_MOCK_STUDENTS[2], name: 'Rohan', currentPhase: 'APPLY', activeMisconception: undefined };
