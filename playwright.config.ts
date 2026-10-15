import { defineConfig, devices } from '@playwright/test'

const isCI = Boolean(process.env.CI)

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'
const port = new URL(baseURL).port || '3000'

// Set PLAYWRIGHT_SKIP_WEBSERVER=true to run against an already running server
// (for example a deployed preview environment) without starting one here.
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === 'true'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    // Artifacts are only kept when they help debug a failure.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: skipWebServer
    ? undefined
    : {
        // CI tests the production build; locally the dev server gives fast feedback.
        command: isCI ? `pnpm start --port ${port}` : `pnpm dev --port ${port}`,
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
})
