export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'online' | 'offline';
  currentPhase: string;
  activeMisconception?: string;
}

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vivaan', 'Diya', 'Aditya', 'Sneha',
  'Arjun', 'Neha', 'Sai', 'Kavya', 'Reyansh', 'Ishita', 'Ayaan', 'Riya',
  'Krishna', 'Anushka', 'Ishaan', 'Meera', 'Dhruv', 'Sanya', 'Kabir', 'Tara',
  'Shaurya', 'Nisha', 'Atharv', 'Kiara', 'Aarush', 'Myra'
];

export const TEACHER_MOCK_STUDENTS: Student[] = Array.from({ length: 30 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: FIRST_NAMES[i] || `Student ${i + 1}`,
  avatarUrl: `https://i.pravatar.cc/150?u=student${i}`,
  // 90% online for demo purposes
  status: Math.random() > 0.1 ? 'online' : 'offline',
  // Distribute across phases
  currentPhase: ['PREDICT', 'EXPERIMENT', 'OBSERVE', 'EXPLAIN', 'APPLY'][Math.floor(Math.random() * 5)],
  // Roughly 20% struggling with a misconception
  activeMisconception: Math.random() > 0.8 ? 'M_NO_BATTERY_NO_CURRENT' : undefined,
}));

// Hardcode a few specific ones to ensure the script demo always has something to show
TEACHER_MOCK_STUDENTS[0] = { ...TEACHER_MOCK_STUDENTS[0], name: 'Aarav', currentPhase: 'EXPERIMENT', activeMisconception: 'M_NO_BATTERY_NO_CURRENT' };
TEACHER_MOCK_STUDENTS[1] = { ...TEACHER_MOCK_STUDENTS[1], name: 'Priya', currentPhase: 'EXPLAIN', activeMisconception: undefined };
TEACHER_MOCK_STUDENTS[2] = { ...TEACHER_MOCK_STUDENTS[2], name: 'Rohan', currentPhase: 'APPLY', activeMisconception: undefined };
