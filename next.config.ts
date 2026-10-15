import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Extra hostnames (no scheme or port) allowed to load dev assets and HMR, e.g. when the dev
// server sits behind the backend's Nginx proxy as `platform.test`. Comma-separated.
const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins,
}

// Registers `src/i18n/request.ts` as the per-request i18n config.
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
