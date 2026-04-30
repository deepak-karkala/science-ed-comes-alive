import { Language } from './lesson';
import { MisconceptionTag } from './misconception';
import { SimulationOutput } from './simulation';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SocraticRequest<T extends SimulationOutput = SimulationOutput> {
  lessonId: string;
  language: Language;
  sessionHistory: ChatMessage[];
  simState: T;
  studentMessage: string;
}

export interface MisconceptionRequest {
  lessonId: string;
  studentResponse: string;
}

export interface MisconceptionResponse {
  has_misconception: boolean;
  confidence: number;
  tag: MisconceptionTag;
}
