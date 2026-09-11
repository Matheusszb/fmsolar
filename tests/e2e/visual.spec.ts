import { test, expect } from '@playwright/test';
test('revisão visual e carregamento da logo e gráficos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Liberdade energética/ })).toBeVisible();
  await page
    .locator('.brand img')
    .first()
    .evaluate((im: HTMLImageElement) => im.decode());
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ caret: 'initial', path: 'test-results/hero-desktop.png' });
  await page.screenshot({
    caret: 'initial',
    path: 'test-results/home-desktop.png',
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Liberdade energética/ })).toBeVisible();
  await page
    .locator('.brand img')
    .first()
    .evaluate((im: HTMLImageElement) => im.decode());
  await page.screenshot({ caret: 'initial', path: 'test-results/home-mobile.png', fullPage: true });
  await page.screenshot({ caret: 'initial', path: 'test-results/hero-mobile.png' });
  await page.goto('/calculadora?conta=2000');
  await page.getByRole('button', { name: 'Calcular Economia', exact: true }).click();
  await expect(page.locator('.recharts-surface').first()).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({
    caret: 'initial',
    path: 'test-results/calculator-mobile.png',
    fullPage: true,
  });
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Painel Administrativo' })).toBeVisible();
  await page.screenshot({
    caret: 'initial',
    path: 'test-results/login-mobile.png',
    fullPage: true,
  });
});
