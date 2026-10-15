import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LocaleSwitcher } from '@/components/shared/locale-switcher'

import en from '../../messages/en.json'

const replace = vi.fn()

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ replace }),
}))

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    replace.mockClear()
  })

  it('marks the active locale and switches to another one on the same path', async () => {
    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale='en' messages={en}>
        <LocaleSwitcher />
      </NextIntlClientProvider>,
    )

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Українська' }))

    expect(replace).toHaveBeenCalledWith('/dashboard', { locale: 'uk' })
  })
})
