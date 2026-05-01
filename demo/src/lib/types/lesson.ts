import { MisconceptionTag } from './misconception';

export type LessonId = '1' | '2' | '3';

export type LessonPhase = 'PREDICT' | 'EXPERIMENT' | 'OBSERVE' | 'EXPLAIN' | 'APPLY';

export type Language = 'en' | 'hi';

export type Subject = 'physics' | 'chemistry' | 'biology';

export interface LessonConfig {
  id: LessonId;
  title: string;
  ncertReference: string;
  subject: Subject;
  valueStatement: string;
  misconceptionTargets: MisconceptionTag[];
  applyPrompt: string;
  summaryCopy: {
    concepts: string[];
    dinnerTableQuestion: string;
    nextLessonPreview: string;
  };
}
