export type LessonPhase = 'PREDICT' | 'EXPERIMENT' | 'OBSERVE' | 'EXPLAIN' | 'APPLY';

export type Language = 'en' | 'hi';

export type Subject = 'physics' | 'chemistry' | 'biology';

export interface LessonConfig {
  id: string;
  title: string;
  ncertReference: string;
  subject: Subject;
  misconceptionTargets: string[];
  applyPrompt: string;
  summaryCopy: {
    concepts: string[];
    dinnerTableQuestion: string;
    nextLessonPreview: string;
  };
}
