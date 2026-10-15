import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

// Locale-aware replacements for the `next/link` and `next/navigation` APIs. Use these instead
// of the originals so links and redirects keep the current locale.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
