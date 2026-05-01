import React from 'react';

interface FieldControlsProps {
  magneticField: number;
  onMagneticFieldChange: (b: number) => void;
  velocity: number;
  onVelocityChange: (v: number) => void;
  onInteract?: () => void;
}

const PRESETS = [0.1, 0.5, 1.0];

export function FieldControls({
  magneticField,
  onMagneticFieldChange,
  velocity,
  onVelocityChange,
  onInteract,
}: FieldControlsProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-6 px-8">
      {/* Magnetic Field Control */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Magnetic Field (T)
          </label>
        </div>
        <div className="flex gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                onMagneticFieldChange(preset);
                onInteract?.();
              }}
              className={`flex-1 py-2 rounded-lg font-mono text-sm border transition-all ${
                magneticField === preset
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm shadow-[var(--accent-glow)]'
                  : 'bg-[var(--surface-hover)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
              }`}
            >
              {preset.toFixed(1)}T
            </button>
          ))}
        </div>
      </div>

      {/* Wire Velocity Control */}
      <div>
        <div className="flex justify-between mb-2">
          <label htmlFor="velocity-slider" className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Wire Velocity (m/s)
          </label>
          <span className="font-mono text-sm text-[var(--text-primary)]">
            {velocity.toFixed(1)} m/s
          </span>
        </div>
        <input
          id="velocity-slider"
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={velocity}
          onChange={(e) => {
            onVelocityChange(parseFloat(e.target.value));
            onInteract?.();
          }}
          className="w-full accent-[var(--accent)]"
        />
        <div className="flex justify-between mt-1 text-xs text-[var(--text-muted)] font-mono">
          <span>Stationary</span>
          <span>Fast</span>
        </div>
      </div>
    </div>
  );
}
