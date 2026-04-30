import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LessonShell } from './LessonShell';
import { PHYSICS_LESSON } from '../../data/lessons';

describe('LessonShell', () => {
  it('renders lesson title and initial PREDICT phase', () => {
    render(<LessonShell lesson={PHYSICS_LESSON} />);
    
    expect(screen.getByRole('heading', { name: PHYSICS_LESSON.title })).toBeInTheDocument();
    expect(screen.getByText('PREDICT')).toBeInTheDocument();
  });

  it('can toggle language state', async () => {
    const user = userEvent.setup();
    render(<LessonShell lesson={PHYSICS_LESSON} />);
    
    const hindiButton = screen.getByRole('button', { name: /हिंदी/i });
    await user.click(hindiButton);
    
    expect(hindiButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders placeholders for content areas', () => {
    render(<LessonShell lesson={PHYSICS_LESSON} />);
    expect(screen.getByText(/Simulation Area/i)).toBeInTheDocument();
  });

  it('navigates the full state machine: PREDICT -> EXPERIMENT -> EXPLAIN -> APPLY', async () => {
    const user = userEvent.setup();
    render(<LessonShell lesson={PHYSICS_LESSON} />);
    
    // 1. PREDICT phase
    expect(screen.getByText('PREDICT')).toBeInTheDocument();
    expect(screen.getByText(PHYSICS_LESSON.applyPrompt)).toBeInTheDocument();
    
    // 2. Transition to EXPERIMENT
    await user.type(screen.getByRole('textbox'), 'Hypothesis');
    await user.click(screen.getByRole('button', { name: /Next/i }));
    
    expect(screen.getByText('EXPERIMENT')).toBeInTheDocument();
    expect(screen.getByText(/Socratic chat is locked/i)).toBeInTheDocument();
    
    // 3. Transition to EXPLAIN via simulation interaction
    await user.click(screen.getByRole('button', { name: /Mock: Interact with Simulation/i }));
    
    expect(screen.getByText('EXPLAIN')).toBeInTheDocument();
    
    // 4. AI Exchange turns
    const aiButton = screen.getByRole('button', { name: /Mock: AI Exchange/i });
    
    // First turn -> Still EXPLAIN
    await user.click(aiButton);
    expect(screen.getByText('EXPLAIN')).toBeInTheDocument();
    
    // Second turn -> Transitions to APPLY
    await user.click(aiButton);
    
    expect(screen.getByText('APPLY')).toBeInTheDocument();
    
    // 5. Apply card renders
    expect(screen.getByText('Knowledge Applied')).toBeInTheDocument();
    expect(screen.getByText(PHYSICS_LESSON.summaryCopy.dinnerTableQuestion)).toBeInTheDocument();
  });
});
