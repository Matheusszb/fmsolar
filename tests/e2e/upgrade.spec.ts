import { test, expect } from '@playwright/test';
test('simulação ao digitar, slider e dados do WhatsApp permanecem sincronizados', async ({
  page,
}) => {
  await page.goto('/calculadora');
  await page.getByLabel('Valor médio da conta de luz (R$)').fill('R$ 1.000,00');
  await expect(page.getByText('R$ 800', { exact: true })).toBeVisible();
  await page.getByRole('slider', { name: 'Ajuste rápido da conta' }).fill('3500');
  await expect(page.getByText('R$ 2.800', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Valor médio da conta de luz (R$)')).toHaveValue('3500');
  await page.getByLabel('Tipo de ligação').selectOption('Trifásica');
  await page.getByLabel('Tipo de imóvel').selectOption('Comercial');
  const url = decodeURIComponent(
    (await page
      .getByRole('link', { name: 'Quero Orçamento Exato no WhatsApp' })
      .getAttribute('href'))!,
  );
  expect(url.replace(/\u00a0/g, ' ')).toContain('Conta média: R$ 3.500');
  expect(url).toContain('Tipo de ligação: Trifásica');
  expect(url).toContain('Tipo de imóvel: Comercial');
  await page.getByLabel('Valor médio da conta de luz (R$)').fill('inválido');
  await expect(page.getByRole('link', { name: 'Quero Orçamento Exato no WhatsApp' })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Calcular Economia', exact: true }).click();
  await expect(page.locator('.error-message')).toBeVisible();
});
test('FAQ, depoimentos, timeline e movimento reduzido', async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on('console', (message) => {
    if (/hydrated|hydration/i.test(message.text())) hydrationErrors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.timeline-step')).toHaveCount(5);
  const faq = page.getByRole('button', { name: /A FM SOLAR cuida da homologação/ });
  await faq.click();
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: /A FM SOLAR cuida da homologação/ })).toBeVisible();
  await page.getByRole('button', { name: 'Próximo depoimento' }).click();
  await expect(page.locator('.testimonial-author')).toContainText('Fazenda São João');
  expect(
    await page.locator('.hero-metric').evaluate((e) => getComputedStyle(e).animationName),
  ).toBe('none');
  await expect(page.locator('.site-header')).toHaveClass(/scrolled/);
  expect(hydrationErrors).toEqual([]);
});
