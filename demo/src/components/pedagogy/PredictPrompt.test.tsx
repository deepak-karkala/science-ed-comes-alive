import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PredictPrompt } from './PredictPrompt';
import { getTranslation } from '../../lib/i18n';

describe('PredictPrompt', () => {
  it('renders the prompt text and textarea', () => {
    render(<PredictPrompt prompt="What do you think will happen?" onSubmit={vi.fn()} language="en" />);
    
    expect(screen.getByText('What do you think will happen?')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onSubmit with text and disables submit button if empty', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PredictPrompt prompt="Predict" onSubmit={handleSubmit} language="en" />);
    
    const submitBtn = screen.getByRole('button', { name: getTranslation('common.next', 'en') });
    expect(submitBtn).toBeDisabled();
    
    await user.type(screen.getByRole('textbox'), 'I think it will light up.');
    expect(submitBtn).not.toBeDisabled();
    
    await user.click(submitBtn);
    expect(handleSubmit).toHaveBeenCalledWith('I think it will light up.');
  });
});
