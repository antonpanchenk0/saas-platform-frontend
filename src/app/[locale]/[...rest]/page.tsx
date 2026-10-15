import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'

// Catches every unmatched URL under a locale so the localized `not-found.tsx` is rendered
// inside the locale layout (a plain 404 would otherwise have no locale or messages).
export default async function CatchAllPage({ params }: PageProps<'/[locale]/[...rest]'>) {
  const { locale } = await params
  if (hasLocale(routing.locales, locale)) setRequestLocale(locale)

  notFound()
}
