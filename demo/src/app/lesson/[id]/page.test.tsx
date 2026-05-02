import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LessonPage from './page';

vi.mock('next/dynamic', () => ({
  default: () => function MockScene() {
    return <div>Mock EM Scene</div>;
  },
}));

vi.mock('../../../components/shell/LessonShell', () => ({
  LessonShell: ({
    lesson,
    simulationArea,
    controlsArea,
    simulationState,
    simulationInteractionCount,
  }: {
    lesson: { title: string };
    simulationArea?: React.ReactNode;
    controlsArea?: React.ReactNode;
    simulationState?: { is_verified: true };
    simulationInteractionCount?: number;
  }) => (
    <div>
      <h1>{lesson.title}</h1>
      <div data-testid="simulation-area">{simulationArea ?? 'no simulation'}</div>
      <div data-testid="controls-area">{controlsArea ?? 'no controls'}</div>
      <div data-testid="verified-state">{simulationState?.is_verified ? 'verified' : 'missing'}</div>
      <div data-testid="interaction-count">{simulationInteractionCount ?? 0}</div>
    </div>
  ),
}));

// BloodCircuitScene uses Three.js — mock for jsdom
vi.mock('../../../components/simulations/biology/BloodCircuitScene', () => ({
  default: ({ heartRate, o2Saturation }: { heartRate: number; o2Saturation: number }) => (
    <div>Mock Blood Scene bpm={heartRate} o2={o2Saturation}</div>
  ),
}));

describe('LessonPage', () => {
  it('wires the verified physics scene and controls for lesson 1', () => {
    render(<LessonPage params={{ id: '1' }} />);

    expect(screen.getByRole('heading', { name: /electromagnetic induction/i })).toBeInTheDocument();
    expect(screen.getByTestId('simulation-area')).toHaveTextContent('Mock EM Scene');
    expect(screen.getByTestId('controls-area')).toHaveTextContent('0.1T');
    expect(screen.getByTestId('verified-state')).toHaveTextContent('verified');
  });

  it('wires the verified chemistry scene and substance panel for lesson 2', () => {
    render(<LessonPage params={{ id: '2' }} />);

    expect(screen.getByRole('heading', { name: /the color of ph/i })).toBeInTheDocument();
    // Chemistry simulation area should render (BeakerSimulation)
    expect(screen.getByTestId('simulation-area')).toHaveTextContent(/ph value/i);
    // Controls show substance buttons
    expect(screen.getByTestId('controls-area')).toHaveTextContent(/नींबू पानी/i);
    expect(screen.getByTestId('verified-state')).toHaveTextContent('verified');
  });

  it('wires the verified biology scene and heart rate controls for lesson 3', () => {
    render(<LessonPage params={{ id: '3' }} />);

    expect(screen.getByRole('heading', { name: /blood flow journey/i })).toBeInTheDocument();
    expect(screen.getByTestId('simulation-area')).toHaveTextContent(/mock blood scene/i);
    // Controls show heart rate buttons
    expect(screen.getByTestId('controls-area')).toHaveTextContent(/sleeping/i);
    expect(screen.getByTestId('verified-state')).toHaveTextContent('verified');
  });

  it('renders a 404 message for an unknown lesson route', () => {
    render(<LessonPage params={{ id: '404' }} />);
    expect(screen.getByText(/mission parameter invalid\. 404\./i)).toBeInTheDocument();
  });
});
