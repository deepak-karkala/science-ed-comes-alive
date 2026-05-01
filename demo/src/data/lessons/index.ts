import { LessonConfig } from '../../lib/types/lesson';

export const PHYSICS_LESSON: LessonConfig = {
  id: '1',
  title: 'Magnetic Magic',
  ncertReference: 'NCERT Class 10, Chapter 13: Magnetic Effects of Electric Current',
  subject: 'physics',
  valueStatement: 'See a verified induction model turn motion into visible current and tutor-guided reasoning.',
  misconceptionTargets: ['ELECTRICITY_STORED_MYTH', 'MAGNET_AS_SOURCE_MYTH'],
  applyPrompt: 'If we move the magnet faster, what will happen to the bulb?',
  summaryCopy: {
    concepts: ['Electromagnetic Induction', 'Relative Motion', 'Current Generation'],
    dinnerTableQuestion: 'How can you create electricity using just a magnet and a wire coil?',
    nextLessonPreview: 'Next, we will explore how industrial generators use this principle.',
  }
};

export const CHEMISTRY_LESSON: LessonConfig = {
  id: '2',
  title: 'The Color of pH',
  ncertReference: 'NCERT Class 10, Chapter 2: Acids, Bases and Salts',
  subject: 'chemistry',
  valueStatement: 'Mix familiar substances and watch the pH model explain neutralization with instant visual feedback.',
  misconceptionTargets: ['ACID_ALWAYS_BURNS_MYTH', 'MORE_DROPS_CHANGES_PH_MYTH'],
  applyPrompt: 'What happens if we mix equal drops of lemon juice (pH 2.5) and antacid (pH 9.5)?',
  summaryCopy: {
    concepts: ['pH Scale', 'Universal Indicator', 'Neutralization'],
    dinnerTableQuestion: 'Why does soda water have a lower pH than milk?',
    nextLessonPreview: 'Next, we will explore the difference between strong and weak acids.',
  }
};

export const BIOLOGY_LESSON: LessonConfig = {
  id: '3',
  title: 'Blood Flow Journey',
  ncertReference: 'NCERT Class 10, Chapter 6: Life Processes',
  subject: 'biology',
  valueStatement: 'Follow a red blood cell through circulation and correct the most common blood-color misconceptions.',
  misconceptionTargets: ['BLOOD_COLOR_MYTH', 'CIRCULATORY_ISOLATION_MYTH'],
  applyPrompt: 'As the red blood cell passes through the muscle capillary, what happens to its color and oxygen level?',
  summaryCopy: {
    concepts: ['Double Circulation', 'Oxygenation', 'Cellular Respiration'],
    dinnerTableQuestion: 'If deoxygenated blood isn\'t blue, why do veins look blue through our skin?',
    nextLessonPreview: 'Next, we will explore the internal structure of the heart.',
  }
};

export const LESSONS: LessonConfig[] = [PHYSICS_LESSON, CHEMISTRY_LESSON, BIOLOGY_LESSON];

export function getLessonById(id: string) {
  return LESSONS.find((lesson) => lesson.id === id);
}
