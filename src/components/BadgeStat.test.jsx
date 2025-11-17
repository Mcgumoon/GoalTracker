import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BadgeStat from './BadgeStat'

describe('BadgeStat Component', () => {
  it('renders the badge with fire emoji and count', () => {
    render(<BadgeStat stats={{ badges_count: 5 }} />)
    
    expect(screen.getByText('🔥')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Badges')).toBeInTheDocument()
  })

  it('displays the correct count value', () => {
    render(<BadgeStat stats={{ badges_count: 3 }} />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('defaults to 0 when badges_count is not provided', () => {
    render(<BadgeStat stats={{}} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})