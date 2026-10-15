import type { routing } from '@/i18n/routing'

import type messages from '../../messages/en.json'

// Makes locales and message keys type-checked: `t('typo')` fails `pnpm typecheck`.
// `en.json` is the source of truth; other locales must provide the same keys.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
