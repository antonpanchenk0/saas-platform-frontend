import { useTranslations } from 'next-intl'

import { LocaleSwitcher } from '@/components/shared/locale-switcher'

export function HomeView() {
  const t = useTranslations('HomePage')

  return (
    <main className='mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-2 p-6'>
      <h1 className='text-3xl font-semibold tracking-tight'>{t('title')}</h1>
      <p className='text-muted-foreground'>{t('description')}</p>
      <LocaleSwitcher />
    </main>
  )
}
