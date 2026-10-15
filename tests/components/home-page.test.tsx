import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/page'
import { Button } from '@/components/ui/button'

describe('HomePage', () => {
  it('renders the page heading', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Tecca' })).toBeInTheDocument()
  })
})

describe('Button', () => {
  it('calls onClick when the user clicks it', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Save</Button>)
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
