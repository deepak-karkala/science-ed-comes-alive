import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the demo lesson selector placeholder', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: /science education comes alive/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /electromagnetic induction/i })).toHaveAttribute(
      'href',
      '/lesson/1',
    )
    expect(screen.getByRole('link', { name: /teacher dashboard placeholder/i })).toHaveAttribute(
      'href',
      '/teacher',
    )
  })

  it('uses the design-system surface classes for the scaffold', () => {
    render(<HomePage />)

    expect(screen.getByRole('main')).toHaveClass('page-shell')
    expect(screen.getByRole('link', { name: /electromagnetic induction/i })).toHaveClass(
      'lesson-card',
    )
  })
})
