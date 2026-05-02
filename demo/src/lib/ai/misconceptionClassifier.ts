import { MisconceptionTag } from '../types/misconception';

export interface ClassificationResult {
  tag: MisconceptionTag;
  confidence: number;
}

const TAG = {
  ELECTRICITY_STORED: 'ELECTRICITY_STORED_MYTH' as MisconceptionTag,
  MAGNET_AS_SOURCE:  'MAGNET_AS_SOURCE_MYTH'  as MisconceptionTag,
  BLOOD_COLOR:       'BLOOD_COLOR_MYTH'       as MisconceptionTag,
  CIRC_ISOLATION:    'CIRCULATORY_ISOLATION_MYTH' as MisconceptionTag,
} as const;

const HEURISTIC_DICTIONARY: Record<string, { tag: MisconceptionTag; keywords: string[] }[]> = {
  physics: [
    {
      tag: TAG.ELECTRICITY_STORED,
      keywords: [
        'battery', 'battery se', 'battery mein hai', 'battery stores',
        'battery mein', 'stored inside', 'already has electricity',
        'contains electricity', 'electricity inside the wire'
      ]
    },
    {
      tag: TAG.MAGNET_AS_SOURCE,
      keywords: [
        'magnet deta hai', 'magnet se milti', 'magnet se',
        'magnet gives', 'magnet gives energy',
        'energy from the magnet', 'magnet has energy', 'magnet powers'
      ]
    }
  ],
  biology: [
    {
      tag: TAG.BLOOD_COLOR,
      keywords: ['blood is blue', 'blue until', 'turns blue', 'deoxygenated blood is blue']
    },
    {
      tag: TAG.CIRC_ISOLATION,
      keywords: ['stays in the heart', 'isolated in', 'doesn\'t leave the heart']
    }
  ]
};

const THRESHOLD = 0.75;

export function classifyMisconception(text: string, subject: 'physics' | 'biology' | 'chemistry'): ClassificationResult | null {
  if (!text || text.trim().length === 0) return null;
  
  const normalizedText = text.toLowerCase();
  const rules = HEURISTIC_DICTIONARY[subject];
  
  if (!rules) return null;

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (normalizedText.includes(keyword)) {
        // In a real app, this would use a fast local embedding model.
        // For the demo, heuristic exact match gives high confidence.
        return { tag: rule.tag, confidence: 0.85 };
      }
    }
  }

  return null;
}
