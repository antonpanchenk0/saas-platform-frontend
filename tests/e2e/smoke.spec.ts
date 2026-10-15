import { expect, test } from '@playwright/test'

test('redirects to the default locale and renders the home page', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/en$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Tecca')
  await expect(page.getByRole('heading', { level: 1, name: 'Tecca' })).toBeVisible()
})

test('switches the language', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('button', { name: 'Українська' }).click()

  await expect(page).toHaveURL(/\/uk$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
  await expect(page.getByText('Основу проєкту налаштовано.')).toBeVisible()
})

test('renders a localized 404 page', async ({ page }) => {
  const response = await page.goto('/uk/does-not-exist')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Сторінку не знайдено' })).toBeVisible()
})
