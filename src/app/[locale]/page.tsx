import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { HomeView } from '@/features/home/home-view'
import { routing } from '@/i18n/routing'

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Enables static rendering for this locale.
  setRequestLocale(locale)

  return <HomeView />
}
