import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '@/components/ui/button'
import { HomeView } from '@/features/home/home-view'

import en from '../../messages/en.json'
import uk from '../../messages/uk.json'

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
}))

describe('HomeView', () => {
  it('renders the page heading', () => {
    render(
      <NextIntlClientProvider locale='en' messages={en}>
        <HomeView />
      </NextIntlClientProvider>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Tecca' })).toBeInTheDocument()
    expect(screen.getByText(en.HomePage.description)).toBeInTheDocument()
  })

  it('renders translated content for the active locale', () => {
    render(
      <NextIntlClientProvider locale='uk' messages={uk}>
        <HomeView />
      </NextIntlClientProvider>,
    )

    expect(screen.getByText(uk.HomePage.description)).toBeInTheDocument()
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
