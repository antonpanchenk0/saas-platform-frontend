import { describe, expect, it } from 'vitest'

import { cn } from '@/lib/utils'

describe('cn', () => {
  it('joins class names and skips falsy values', () => {
    expect(cn('px-2', false, undefined, 'text-sm')).toBe('px-2 text-sm')
  })

  it('lets later Tailwind utilities override conflicting earlier ones', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
