import { SimulationOutput } from '../types/simulation';

export type SubstanceId = 'lemon_juice' | 'vinegar' | 'tamarind_water' | 'soda_water' | 'milk' | 'baking_soda' | 'antacid';

export interface SubstanceDef {
  ph: number;
  hindi: string;
  color: string;
}

export const SUBSTANCES: Record<SubstanceId, SubstanceDef> = {
  lemon_juice:    { ph: 2.5, hindi: "नींबू पानी",   color: "#FF4444" },
  vinegar:        { ph: 3.0, hindi: "सिरका",          color: "#FF6633" },
  tamarind_water: { ph: 3.5, hindi: "इमली का पानी",  color: "#FF8844" },
  soda_water:     { ph: 5.5, hindi: "सोडा वाटर",     color: "#CCEE44" },
  milk:           { ph: 6.5, hindi: "दूध",             color: "#EEFF88" },
  baking_soda:    { ph: 8.5, hindi: "खाने का सोडा",  color: "#88BBFF" },
  antacid:        { ph: 9.5, hindi: "डाइजीन",         color: "#4488FF" },
};

export type Drops = Partial<Record<SubstanceId, number>>;

export interface PHState extends SimulationOutput {
  is_verified: true;
  ph: number;
  color: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 255, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

function interpolateColor(ph: number): string {
  if (ph <= 1) return '#FF0000';
  if (ph >= 14) return '#8A2BE2';
  
  let c1, c2, ratio;
  if (ph < 7) {
    c1 = hexToRgb('#FF0000'); // Red
    c2 = hexToRgb('#00FF00'); // Green
    ratio = (ph - 1) / 6; // Range from 1 to 7
  } else {
    c1 = hexToRgb('#00FF00'); // Green
    c2 = hexToRgb('#8A2BE2'); // Violet
    ratio = (ph - 7) / 7; // Range from 7 to 14
  }
  
  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
  
  return rgbToHex(r, g, b);
}

export function computePHMix(drops: Drops): PHState {
  let totalDrops = 0;
  let weightedPH = 0;

  for (const [key, count] of Object.entries(drops)) {
    const substanceId = key as SubstanceId;
    if (SUBSTANCES[substanceId] && count !== undefined) {
      totalDrops += count;
      weightedPH += SUBSTANCES[substanceId].ph * count;
    }
  }

  const ph = totalDrops === 0 ? 7.0 : Number((weightedPH / totalDrops).toFixed(2));

  let color = '#00FF00'; // Default neutral green
  
  const activeSubstances = Object.entries(drops).filter(([_, count]) => count !== undefined && count > 0);
  if (activeSubstances.length === 1) {
    // Exact match for a single substance
    const substanceId = activeSubstances[0][0] as SubstanceId;
    if (SUBSTANCES[substanceId]) {
      color = SUBSTANCES[substanceId].color;
    }
  } else {
    // Interpolate for mixtures
    color = interpolateColor(ph);
  }

  return {
    is_verified: true,
    ph,
    color
  };
}
