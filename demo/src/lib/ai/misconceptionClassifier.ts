export type MisconceptionTag = 
  | 'ELECTRICITY_STORED_MYTH' 
  | 'MAGNET_AS_SOURCE_MYTH'
  | 'BLOOD_COLOR_MYTH'
  | 'CIRCULATORY_ISOLATION_MYTH';

export interface ClassificationResult {
  tag: MisconceptionTag;
  confidence: number;
}

const HEURISTIC_DICTIONARY: Record<string, { tag: MisconceptionTag; keywords: string[] }[]> = {
  physics: [
    {
      tag: 'ELECTRICITY_STORED_MYTH',
      keywords: ['stored inside', 'already has electricity', 'contains electricity', 'electricity inside the wire']
    },
    {
      tag: 'MAGNET_AS_SOURCE_MYTH',
      keywords: ['magnet gives', 'energy from the magnet', 'magnet has energy', 'magnet powers']
    }
  ],
  biology: [
    {
      tag: 'BLOOD_COLOR_MYTH',
      keywords: ['blood is blue', 'blue until', 'turns blue', 'deoxygenated blood is blue']
    },
    {
      tag: 'CIRCULATORY_ISOLATION_MYTH',
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
