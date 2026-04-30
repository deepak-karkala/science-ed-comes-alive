export type MisconceptionTag =
  | 'ELECTRICITY_STORED_MYTH'
  | 'MAGNET_AS_SOURCE_MYTH'
  | 'BLOOD_COLOR_MYTH'
  | 'CIRCULATORY_ISOLATION_MYTH'
  | 'none';

export interface MisconceptionEvent {
  tag: MisconceptionTag;
  confidence: number;
  timestamp: number;
}
