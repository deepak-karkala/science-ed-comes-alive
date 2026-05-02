'use client';

import React from 'react';
import { SUBSTANCES, SubstanceId } from '../../../lib/simulations/phEngine';
import { Language } from '../../../lib/types/lesson';

interface SubstancePanelProps {
  onSubstanceDrop: (id: SubstanceId) => void;
  language?: Language;
  drops?: Partial<Record<SubstanceId, number>>;
}

export function SubstancePanel({ onSubstanceDrop, language = 'en', drops = {} }: SubstancePanelProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 px-6">
      <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
        Add drops — click to mix
      </label>
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(SUBSTANCES) as SubstanceId[]).map((id) => {
          const sub = SUBSTANCES[id];
          const count = drops[id] ?? 0;
          const label = language === 'hi' ? sub.hindi : sub.english;
          return (
            <button
              key={id}
              onClick={() => onSubstanceDrop(id)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--accent)] hover:bg-[var(--surface)] transition-all group relative"
              aria-label={`Add ${sub.english} (pH ${sub.ph})`}
              title={`pH ${sub.ph}`}
            >
              <div
                className="w-6 h-6 rounded-full border border-[var(--border)]"
                style={{ backgroundColor: sub.color }}
              />
              <span className="text-[9px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] leading-tight text-center">
                {label}
              </span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-[8px] font-bold text-white flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
