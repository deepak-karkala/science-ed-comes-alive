import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LanguageToggle } from './LanguageToggle';

describe('LanguageToggle', () => {
  it('renders correctly with current language', () => {
    render(<LanguageToggle current="en" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /हिंदी/i })).toBeInTheDocument();
  });

  it('calls onChange when clicking the inactive language', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<LanguageToggle current="en" onChange={handleChange} />);
    
    await user.click(screen.getByRole('button', { name: /हिंदी/i }));
    expect(handleChange).toHaveBeenCalledWith('hi');
  });
});
