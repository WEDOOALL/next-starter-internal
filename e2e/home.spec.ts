import { test, expect } from '@playwright/test';

/**
 * E2E: home page shows the CF Access operator email.
 *
 * In dev mode, MOCK_OPERATOR_EMAIL is injected via Playwright webServer env.
 * In production behind CF Access, the real JWT email is decoded server-side.
 */
test('home page loads and shows operator email', async ({ page }) => {
  await page.goto('/');

  const emailEl = page.getByTestId('operator-email');
  await expect(emailEl).toBeVisible();
  await expect(emailEl).toContainText('e2e-test@wedooall.com');
});

test('home page returns 200', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
});
