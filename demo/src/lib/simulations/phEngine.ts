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
  if (ph <= 3) {
    color = '#FF0000'; // deep red
  } else if (ph >= 9) {
    color = '#8A2BE2'; // violet
  } else if (ph === 7) {
    color = '#00FF00'; // green
  }

  return {
    is_verified: true,
    ph,
    color
  };
}
