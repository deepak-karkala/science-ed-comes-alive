import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LessonCard } from './LessonCard';
import { PHYSICS_LESSON } from '../../data/lessons';

describe('LessonCard', () => {
  it('renders lesson information correctly', () => {
    render(<LessonCard lesson={PHYSICS_LESSON} index={1} />);

    // Check title
    expect(screen.getByRole('heading', { name: PHYSICS_LESSON.title })).toBeInTheDocument();
    
    // Check subject
    expect(screen.getByText('physics')).toBeInTheDocument();
    
    // Check NCERT reference
    expect(screen.getByText(PHYSICS_LESSON.ncertReference)).toBeInTheDocument();

    // Check link destination
    expect(screen.getByRole('link')).toHaveAttribute('href', `/lesson/${PHYSICS_LESSON.id}`);
  });
});
