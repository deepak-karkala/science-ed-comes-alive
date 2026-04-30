export interface ConceptNode {
  id: string;
  label: string;
  status: 'mastered' | 'learning' | 'locked';
  prerequisites: string[];
}

export const KNOWLEDGE_GRAPH: ConceptNode[] = [
  // Physics
  { id: 'magnetism', label: 'Magnetism', status: 'mastered', prerequisites: [] },
  { id: 'electric_current', label: 'Electric Current', status: 'mastered', prerequisites: [] },
  { id: 'electromagnetic_induction', label: 'EM Induction', status: 'learning', prerequisites: ['magnetism', 'electric_current'] },
  
  // Chemistry
  { id: 'acids_bases', label: 'Acids & Bases', status: 'mastered', prerequisites: [] },
  { id: 'ph_scale', label: 'pH Scale', status: 'learning', prerequisites: ['acids_bases'] },
  { id: 'neutralization', label: 'Neutralization', status: 'locked', prerequisites: ['ph_scale'] },
  
  // Biology
  { id: 'respiration', label: 'Respiration', status: 'mastered', prerequisites: [] },
  { id: 'circulation', label: 'Circulation', status: 'learning', prerequisites: [] },
  { id: 'oxygenation', label: 'Oxygenation', status: 'locked', prerequisites: ['respiration', 'circulation'] },
];
