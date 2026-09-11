import { solarConfig as c } from '../config/solarCalculator';
export function parseCurrency(value: string): number {
  const clean = value
    .trim()
    .replace(/^R\$\s*/, '')
    .replace(/\s/g, '');
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(clean)) return NaN;
  return Number(clean.replace(/\./g, '').replace(',', '.'));
}
export const currency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
export const decimal = (value: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value);
export function calculateSolar(contaMensal: number) {
  if (!Number.isFinite(contaMensal) || contaMensal <= 0 || contaMensal > 1e9)
    throw new Error('Informe uma conta válida, maior que zero e até R$ 1 bilhão.');
  const economiaMensal = contaMensal * c.reducaoEstimada;
  const novaConta = contaMensal - economiaMensal;
  const economiaAnual = economiaMensal * 12;
  const consumoMensalKwh = contaMensal / c.tarifaEnergia;
  const potenciaKwp = Math.round((consumoMensalKwh / c.producaoMensalPorKwp) * 10) / 10;
  const investimentoEstimado = potenciaKwp * c.custoPorKwp;
  const paybackAnos = investimentoEstimado / economiaAnual;
  let acumulado = 0;
  const years = Array.from({ length: c.anosAnalise }, (_, index) => {
    const economia = economiaAnual * (1 + c.inflacaoEnergeticaAnual) ** index;
    acumulado += economia;
    return { ano: index + 1, economia, acumulado, investimento: investimentoEstimado };
  });
  return {
    contaMensal,
    economiaMensal,
    novaConta,
    economiaAnual,
    consumoMensalKwh,
    potenciaKwp,
    investimentoEstimado,
    paybackAnos,
    acumulado,
    years,
  };
}
