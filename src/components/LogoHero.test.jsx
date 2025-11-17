import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LogoHero from './LogoHero'

describe('LogoHero Component', () => {
  it('renders with default label "GT"', () => {
    render(<LogoHero />)
    
    expect(screen.getByText('GT')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<LogoHero label="GT" />)
    
    expect(screen.getByText('GT')).toBeInTheDocument()
  })

  it('has accessibility label', () => {
    const { container } = render(<LogoHero />)
    
    const logo = container.querySelector('[aria-label="App logo"]')
    expect(logo).toBeInTheDocument()
  })

  it('applies default size style', () => {
    const { container } = render(<LogoHero />)
    
    const logo = container.querySelector('[aria-label="App logo"]')
    expect(logo).toHaveStyle({ width: '88px', height: '88px' })
  })

  it('applies custom size style', () => {
    const { container } = render(<LogoHero size={120} />)
    
    const logo = container.querySelector('[aria-label="App logo"]')
    expect(logo).toHaveStyle({ width: '120px', height: '120px' })
  })

  it('calculates font size based on logo size', () => {
    const { container } = render(<LogoHero size={200} />)
    
    const logo = container.querySelector('[aria-label="App logo"]')
    const fontSize = Math.max(24, Math.floor(200 * 0.42))
    expect(logo).toHaveStyle({ fontSize: `${fontSize}px` })
  })

  it('has gradient styling classes', () => {
    const { container } = render(<LogoHero />)
    
    const logo = container.querySelector('[aria-label="App logo"]')
    expect(logo).toHaveClass('bg-rose2', 'bg-gradient-to-br', 'from-rose2', 'via-rose3', 'to-violet')
  })

  it('has hover scale animation classes', () => {
    const { container } = render(<LogoHero />)
    
    const logo = container.querySelector('[aria-label="App logo"]')
    expect(logo).toHaveClass('hover:scale-105', 'transition-transform')
  })
})
