import { test, expect } from '@playwright/test';
test('calculadora, validação, WhatsApp e proteção do admin', async ({ page }) => {
  await page.goto('/calculadora?conta=2000');
  await expect(page.getByLabel('Valor médio da conta de luz (R$)')).toHaveValue('2000');
  await page.getByLabel('Tipo de imóvel').selectOption('Rural');
  await page.getByRole('button', { name: 'Calcular Economia', exact: true }).click();
  await expect(page.getByText('R$ 1.600', { exact: true })).toBeVisible();
  await expect(page.getByText('R$ 30.193', { exact: true })).toBeVisible();
  const link = page.getByRole('link', { name: 'Quero Orçamento Exato no WhatsApp' });
  expect(decodeURIComponent((await link.getAttribute('href'))!)).toContain('Tipo de imóvel: Rural');
  await page.getByLabel('Valor médio da conta de luz (R$)').fill('0');
  await page.getByRole('button', { name: 'Calcular Economia', exact: true }).click();
  await expect(page.locator('.error-message')).toBeVisible();
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/admin\?/);
  await expect(page.getByRole('heading', { name: 'Painel Administrativo' })).toBeVisible();
});
test('layout público nos tamanhos solicitados', async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of ['/', '/calculadora?conta=2000', '/obras', '/admin']) {
      await page.goto(route);
      if (route.startsWith('/calculadora')) {
        await page.getByRole('button', { name: 'Calcular Economia', exact: true }).click();
        await expect(page.locator('.recharts-surface').first()).toBeVisible();
      }
      await expect(page.locator('h1:visible,h2:visible').first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${route} em ${width}px`,
      ).toBeTruthy();
    }
  }
});
test('menu mobile e links públicos', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Navegação mobile' })
    .getByRole('link', { name: 'Obras', exact: true })
    .click();
  await expect(page).toHaveURL(/\/obras$/);
  await expect(page.getByText('Novos projetos serão publicados em breve.')).toBeVisible();
  await page.goto('/obras/projeto-inexistente');
  await expect(page.getByRole('heading', { name: 'Projeto não encontrado.' })).toBeVisible();
});
