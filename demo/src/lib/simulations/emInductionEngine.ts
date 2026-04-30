import { SimulationOutput } from '../types/simulation';

export const WIRE_LENGTH = 0.5; // 0.5m wire
export const RESISTANCE = 10;   // 10 ohms

export interface EMFState extends SimulationOutput {
  is_verified: true;
  emf: number;            // Volts: B × L × v
  current: number;        // Amperes: emf / resistance
  bulbBrightness: number; // 0-1, normalized
  electronDensity: number;// for particle visualization
}

export function computeEMF(velocity: number, fieldStrength: number): EMFState {
  const emf = fieldStrength * WIRE_LENGTH * Math.abs(velocity);
  const current = emf / RESISTANCE;
  
  return {
    is_verified: true,
    emf,
    current,
    bulbBrightness: Math.min(1, current * 5),
    electronDensity: Math.min(1, current * 8),
  };
}
