'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from '@/i18n/navigation'
import { localeNames, routing, type Locale } from '@/i18n/routing'

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(locale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale })
    })
  }

  return (
    <div role='group' aria-label={t('label')} className='mt-4 flex gap-2'>
      {routing.locales.map(locale => (
        <Button
          key={locale}
          type='button'
          size='sm'
          variant={locale === currentLocale ? 'default' : 'outline'}
          aria-pressed={locale === currentLocale}
          disabled={isPending}
          lang={locale}
          onClick={() => switchLocale(locale)}
        >
          {localeNames[locale]}
        </Button>
      ))}
    </div>
  )
}
