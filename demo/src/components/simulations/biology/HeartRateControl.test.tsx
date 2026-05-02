import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HeartRateControl } from './HeartRateControl';

const PRESET_BPMS = [60, 90, 150, 180];

describe('HeartRateControl', () => {
  it('renders all 4 heart rate preset buttons', () => {
    render(<HeartRateControl heartRate={60} onHeartRateChange={() => {}} />);
    for (const bpm of PRESET_BPMS) {
      expect(screen.getByRole('button', { name: new RegExp(String(bpm)) })).toBeInTheDocument();
    }
  });

  it('fires onHeartRateChange with the correct bpm on click', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<HeartRateControl heartRate={60} onHeartRateChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /180/ }));
    expect(handleChange).toHaveBeenCalledWith(180);
  });

  it('highlights the active preset in amber', () => {
    render(<HeartRateControl heartRate={150} onHeartRateChange={() => {}} />);

    const activeButton = screen.getByRole('button', { name: /150/ });
    expect(activeButton.className).toContain('accent');
  });

  it('calls onHeartRateChange for each preset independently', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<HeartRateControl heartRate={60} onHeartRateChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /90/ }));
    expect(handleChange).toHaveBeenCalledWith(90);

    await user.click(screen.getByRole('button', { name: /150/ }));
    expect(handleChange).toHaveBeenCalledWith(150);
  });

  it('includes cultural labels (Kabaddi Sprint, Sleeping)', () => {
    render(<HeartRateControl heartRate={60} onHeartRateChange={() => {}} />);
    expect(screen.getByText(/kabaddi/i)).toBeInTheDocument();
    expect(screen.getByText(/sleeping/i)).toBeInTheDocument();
  });
});
