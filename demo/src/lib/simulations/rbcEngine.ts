import { SimulationOutput } from '../types/simulation';

export type CircuitPosition = "right_heart" | "lungs" | "left_heart" | "artery" | "capillary" | "muscle" | "vein";

export interface RBCState extends SimulationOutput {
  is_verified: true;
  position: CircuitPosition;
  o2Saturation: number;    // 0-100
  co2Level: number;        // inverse complement
  color: string;           // computed — NEVER blue
  heartRate: number;       // bpm
  distanceTraveled: number;
  o2Delivered: number;     // cumulative molecule count
}

export const CIRCUIT_PHASES = [
  { position: "right_heart",  duration: 0.5,  o2Sat: 15,  label: "Deoxygenated blood pumped to lungs" },
  { position: "lungs",        duration: 2.0,  o2Sat: 98,  label: "O₂ loaded, CO₂ released" },
  { position: "left_heart",   duration: 0.5,  o2Sat: 97,  label: "Oxygenated blood pumped to body" },
  { position: "artery",       duration: 1.5,  o2Sat: 95,  label: "Traveling to muscle via artery" },
  { position: "capillary",    duration: 2.0,  o2Sat: 40,  label: "O₂ diffusing into muscle cells" },
  { position: "vein",         duration: 1.5,  o2Sat: 15,  label: "Returning to heart via vein" },
] as const;

export function computeRBCColor(o2Saturation: number): string {
  // Oxyhemoglobin (high O₂): bright red
  // Deoxyhemoglobin (low O₂): dark maroon — NOT blue
  const brightness = 0.4 + 0.6 * (o2Saturation / 100);
  const r = Math.round(220 * brightness);
  const g = Math.round(30 * brightness);
  const b = Math.round(30 * brightness);
  return `rgb(${r}, ${g}, ${b})`;
}

export function createRBCState(params: Omit<RBCState, 'is_verified' | 'co2Level' | 'color'>): RBCState {
  return {
    is_verified: true,
    ...params,
    co2Level: 100 - params.o2Saturation,
    color: computeRBCColor(params.o2Saturation),
  };
}
