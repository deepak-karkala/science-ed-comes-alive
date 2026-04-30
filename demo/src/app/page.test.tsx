import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from './page'
import { LESSONS } from '../data/lessons'

describe('HomePage', () => {
  it('renders the demo lesson selector', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: /science education comes alive/i })).toBeInTheDocument()
    
    // Check for the first lesson card
    expect(screen.getByRole('heading', { name: LESSONS[0].title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: new RegExp(LESSONS[0].title, 'i') })).toHaveAttribute(
      'href',
      `/lesson/${LESSONS[0].id}`,
    )

    // Check for the teacher dashboard link
    expect(screen.getByRole('link', { name: /view teacher dashboard/i })).toHaveAttribute(
      'href',
      '/teacher',
    )
  })

  it('uses the design-system surface classes for the scaffold', () => {
    render(<HomePage />)

    expect(screen.getByRole('main')).toHaveClass('page-shell')
  })
})
