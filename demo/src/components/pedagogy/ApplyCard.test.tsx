import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApplyCard } from './ApplyCard';
import { PHYSICS_LESSON } from '../../data/lessons';

describe('ApplyCard', () => {
  it('renders concepts and dinner table question', () => {
    render(<ApplyCard lesson={PHYSICS_LESSON} onFinish={vi.fn()} />);
    
    // Check concepts
    for (const concept of PHYSICS_LESSON.summaryCopy.concepts) {
      expect(screen.getByText(concept)).toBeInTheDocument();
    }
    
    // Check dinner table question
    expect(screen.getByText(PHYSICS_LESSON.summaryCopy.dinnerTableQuestion)).toBeInTheDocument();
  });

  it('calls onFinish when clicking finish button', async () => {
    const user = userEvent.setup();
    const handleFinish = vi.fn();
    render(<ApplyCard lesson={PHYSICS_LESSON} onFinish={handleFinish} />);
    
    await user.click(screen.getByRole('button', { name: /Finish/i }));
    expect(handleFinish).toHaveBeenCalled();
  });
});
