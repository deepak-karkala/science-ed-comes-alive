'use client';

import React from 'react';
import { SUBSTANCES, SubstanceId } from '../../../lib/simulations/phEngine';

interface SubstancePanelProps {
  onSubstanceDrop: (id: SubstanceId) => void;
}

export function SubstancePanel({ onSubstanceDrop }: SubstancePanelProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-6 px-8">
      <div>
        <label className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-3">
          Household Substances
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(SUBSTANCES) as SubstanceId[]).map((id) => {
            const sub = SUBSTANCES[id];
            return (
              <button
                key={id}
                onClick={() => onSubstanceDrop(id)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--accent)] hover:bg-[var(--surface)] transition-all group"
                aria-label={sub.hindi}
              >
                <div
                  className="w-6 h-6 rounded-full border border-[var(--border)]"
                  style={{ backgroundColor: sub.color }}
                />
                <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] leading-tight text-center">
                  {sub.hindi}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
