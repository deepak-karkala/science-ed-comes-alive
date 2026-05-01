export type MisconceptionTag =
  | 'ELECTRICITY_STORED_MYTH'
  | 'MAGNET_AS_SOURCE_MYTH'
  | 'BLOOD_COLOR_MYTH'
  | 'CIRCULATORY_ISOLATION_MYTH'
  | 'ACID_ALWAYS_BURNS_MYTH'
  | 'MORE_DROPS_CHANGES_PH_MYTH'
  | 'none';

export interface MisconceptionEvent {
  tag: MisconceptionTag;
  confidence: number;
  timestamp: number;
}
