import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SubstancePanel } from './SubstancePanel';
import { SUBSTANCES, SubstanceId } from '../../../lib/simulations/phEngine';

describe('SubstancePanel', () => {
  it('renders all 7 substances as buttons', () => {
    render(<SubstancePanel onSubstanceDrop={() => {}} />);
    const ids = Object.keys(SUBSTANCES) as SubstanceId[];
    for (const id of ids) {
      expect(screen.getByRole('button', { name: new RegExp(SUBSTANCES[id].hindi, 'i') })).toBeInTheDocument();
    }
  });

  it('fires onSubstanceDrop with the correct substance id on click', async () => {
    const handleDrop = vi.fn();
    const user = userEvent.setup();
    render(<SubstancePanel onSubstanceDrop={handleDrop} />);

    await user.click(screen.getByRole('button', { name: /नींबू पानी/i }));
    expect(handleDrop).toHaveBeenCalledWith('lemon_juice');
  });

  it('calls onSubstanceDrop for each substance independently', async () => {
    const handleDrop = vi.fn();
    const user = userEvent.setup();
    render(<SubstancePanel onSubstanceDrop={handleDrop} />);

    await user.click(screen.getByRole('button', { name: /डाइजीन/i }));
    expect(handleDrop).toHaveBeenCalledWith('antacid');

    await user.click(screen.getByRole('button', { name: /सिरका/i }));
    expect(handleDrop).toHaveBeenCalledWith('vinegar');
  });
});
