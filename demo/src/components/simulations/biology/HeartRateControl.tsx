'use client';

import React from 'react';

interface HeartRateControlProps {
  heartRate: number;
  onHeartRateChange: (bpm: number) => void;
}

const PRESETS = [
  { bpm: 60,  label: 'Sleeping',    cultural: 'Rest' },
  { bpm: 90,  label: 'Walking',     cultural: 'Walking' },
  { bpm: 150, label: 'Running',     cultural: 'Running' },
  { bpm: 180, label: 'Kabaddi Sprint', cultural: 'Sprint' },
] as const;

export function HeartRateControl({ heartRate, onHeartRateChange }: HeartRateControlProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-6 px-8">
      <div>
        <label className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-3">
          Heart Rate (bpm)
        </label>
        <div className="flex gap-3">
          {PRESETS.map((preset) => {
            const isActive = heartRate === preset.bpm;
            return (
              <button
                key={preset.bpm}
                onClick={() => onHeartRateChange(preset.bpm)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border font-mono text-sm transition-all ${
                  isActive
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm shadow-[var(--accent-glow)]'
                    : 'bg-[var(--surface-hover)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
                }`}
              >
                <span className="font-bold text-lg">{preset.bpm}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
