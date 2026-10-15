import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Add a locale here and create a matching `messages/<locale>.json` file to support it.
  locales: ['en', 'uk'],
  defaultLocale: 'en',
  // Every URL carries its locale (/en/..., /uk/...), which also works on tenant subdomains.
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]

/** Native names, shown in the language switcher (never translated, so users can always find theirs). */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
}
