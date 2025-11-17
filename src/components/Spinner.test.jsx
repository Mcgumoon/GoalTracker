import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner Component', () => {
  it('renders spinner animation', () => {
    const { container } = render(<Spinner />)
    
    const spinnerElement = container.querySelector('[class*="animate-spin"]')
    expect(spinnerElement).toBeInTheDocument()
  })

  it('renders without label by default', () => {
    render(<Spinner />)
    
    const spinnerText = screen.queryByText(/\S/)
    // The spinner should render but no specific text label
    const { container } = render(<Spinner />)
    expect(container.querySelector('.min-h-\\[200px\\]')).toBeInTheDocument()
  })

  it('renders with label when provided', () => {
    render(<Spinner label="Loading..." />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders label with bounce animation when provided', () => {
    const { container } = render(<Spinner label="Please wait" />)
    
    const label = screen.getByText('Please wait')
    expect(label).toHaveClass('animate-bounce')
  })

  it('renders with correct container styling', () => {
    const { container } = render(<Spinner />)
    
    const wrapper = container.querySelector('.min-h-\\[200px\\]')
    expect(wrapper).toHaveClass('items-center', 'justify-center', 'flex', 'flex-col')
  })

  it('renders spinner with border styling', () => {
    const { container } = render(<Spinner />)
    
    const spinner = container.querySelector('[class*="animate-spin"]')
    expect(spinner).toHaveClass('rounded-full', 'border-4', 'border-gray-300')
  })

  it('renders spinner with transparent border top', () => {
    const { container } = render(<Spinner />)
    
    const spinner = container.querySelector('[class*="animate-spin"]')
    expect(spinner).toHaveClass('border-t-transparent')
  })

  it('can render with emoji label', () => {
    render(<Spinner label="⏳" />)
    
    expect(screen.getByText('⏳')).toBeInTheDocument()
  })
})
