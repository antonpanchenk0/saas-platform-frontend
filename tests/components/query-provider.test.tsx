import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QueryProvider } from '@/providers/query-provider'

function StaleTimeProbe() {
  const queryClient = useQueryClient()
  return <p>staleTime: {String(queryClient.getDefaultOptions().queries?.staleTime)}</p>
}

describe('QueryProvider', () => {
  it('provides a QueryClient with the configured defaults to its children', () => {
    render(
      <QueryProvider>
        <StaleTimeProbe />
      </QueryProvider>,
    )

    expect(screen.getByText('staleTime: 60000')).toBeInTheDocument()
  })
})
