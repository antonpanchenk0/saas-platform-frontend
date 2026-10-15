import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { QueryProvider } from '@/providers/query-provider'

import '../globals.css'

// `cyrillic` is required for Ukrainian.
const geist = Geist({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' })

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps<'/[locale]'>, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return { title: t('title'), description: t('description') }
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Enables static rendering for this locale.
  setRequestLocale(locale)

  return (
    <html lang={locale} className={cn('font-sans', geist.variable)}>
      <body className='bg-background text-foreground antialiased'>
        {/* `isolate` creates a stacking context so Base UI portalled popups render above the app. */}
        <div className='isolate flex min-h-svh flex-col'>
          <NextIntlClientProvider>
            <QueryProvider>{children}</QueryProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  )
}
