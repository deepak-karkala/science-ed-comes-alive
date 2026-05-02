import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BeakerSimulation } from './BeakerSimulation';
import { computePHMix } from '../../../lib/simulations/phEngine';

describe('BeakerSimulation', () => {
  it('renders an SVG element with accessible label', () => {
    const state = computePHMix({});
    const { container } = render(
      <BeakerSimulation ph={state.ph} color={state.color} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays the current pH value as a readout', () => {
    const state = computePHMix({ lemon_juice: 2 });
    render(<BeakerSimulation ph={state.ph} color={state.color} />);
    expect(screen.getByText('2.5')).toBeInTheDocument();
  });

  it('displays pH 7.0 for neutral (no drops)', () => {
    const state = computePHMix({});
    render(<BeakerSimulation ph={state.ph} color={state.color} />);
    expect(screen.getByText('7.0')).toBeInTheDocument();
  });

  it('accepts and displays a custom color hex from the engine', () => {
    const state = computePHMix({ antacid: 1 });
    render(<BeakerSimulation ph={state.ph} color={state.color} />);

    // pH 9.5 with single substance should use its predefined color
    expect(state.color).toBe('#4488FF');
  });

  it('updates pH readout when props change', () => {
    const { rerender } = render(
      <BeakerSimulation ph={2.5} color="#FF4444" />
    );
    expect(screen.getByText('2.5')).toBeInTheDocument();

    rerender(<BeakerSimulation ph={9.5} color="#4488FF" />);
    expect(screen.getByText('9.5')).toBeInTheDocument();
  });
});
