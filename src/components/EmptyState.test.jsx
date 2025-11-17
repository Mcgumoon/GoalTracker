import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState Component', () => {
  it('renders with default title and subtitle', () => {
    render(<EmptyState />)
    
    expect(screen.getByText('No goals yet')).toBeInTheDocument()
    expect(screen.getByText('Click "New Goal" to create your first one.')).toBeInTheDocument()
  })

  it('renders with custom title and subtitle', () => {
    render(
      <EmptyState
        title="No tasks found"
        subtitle="Create your first task to get started."
      />
    )
    
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
    expect(screen.getByText('Create your first task to get started.')).toBeInTheDocument()
  })

  it('renders SVG illustration', () => {
    const { container } = render(<EmptyState />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies custom size to container', () => {
    const { container } = render(<EmptyState size={300} />)
    
    const sizeDiv = container.querySelector('[style*="width"]')
    expect(sizeDiv).toHaveStyle({ width: '300px', height: '300px' })
  })

  it('renders illustration with responsive sizing', () => {
    const { container } = render(<EmptyState size={200} />)
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '120') // 200 * 0.6
    expect(svg).toHaveAttribute('height', '120')
  })
})
