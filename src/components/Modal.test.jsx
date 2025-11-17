import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

describe('Modal Component', () => {
  it('does not render when open is false', () => {
    const { container } = render(
      <Modal open={false} title="Test Modal" onClose={() => {}}>
        <p>Content</p>
      </Modal>
    )
    
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
  })

  it('renders modal when open is true', () => {
    render(
      <Modal open={true} title="Test Modal" onClose={() => {}}>
        <p>Content</p>
      </Modal>
    )
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('displays close button', () => {
    render(
      <Modal open={true} title="Test Modal" onClose={() => {}}>
        <p>Content</p>
      </Modal>
    )
    
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal open={true} title="Test Modal" onClose={onClose}>
        <p>Content</p>
      </Modal>
    )
    
    await user.click(screen.getByLabelText('Close modal'))
    
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} title="Test Modal" onClose={onClose}>
        <p>Content</p>
      </Modal>
    )
    
    fireEvent.keyDown(window, { key: 'Escape' })
    
    expect(onClose).toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(
      <Modal open={true} title="Test Modal" onClose={() => {}}>
        <p>Content</p>
      </Modal>
    )
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders children content', () => {
    render(
      <Modal open={true} title="Test Modal" onClose={() => {}}>
        <div>
          <button>Action Button</button>
          <p>Custom content</p>
        </div>
      </Modal>
    )
    
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    expect(screen.getByText('Custom content')).toBeInTheDocument()
  })
})
