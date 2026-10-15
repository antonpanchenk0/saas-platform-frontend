import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

// Detects the locale (URL, cookie, Accept-Language) and redirects/rewrites to the prefixed URL.
export default createMiddleware(routing)

export const config = {
  // Skip API routes, Next.js internals, and any path with a file extension (public assets).
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
}
