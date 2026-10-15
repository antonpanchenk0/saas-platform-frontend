import { describe, expect, it } from 'vitest'

import { routing } from '@/i18n/routing'

import en from '../../messages/en.json'
import uk from '../../messages/uk.json'

const catalogs: Record<(typeof routing.locales)[number], unknown> = { en, uk }

/** Flattens nested messages into dot-separated keys, e.g. `HomePage.title`. */
function keysOf(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    keysOf(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('message catalogs', () => {
  const expected = keysOf(en).sort()

  it.each(routing.locales)('%s has exactly the same keys as the default locale', locale => {
    expect(keysOf(catalogs[locale]).sort()).toEqual(expected)
  })

  it.each(routing.locales)('%s has no empty messages', locale => {
    const messages = JSON.stringify(catalogs[locale])
    expect(messages).not.toContain('""')
  })
})
