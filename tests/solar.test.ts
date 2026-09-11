import { describe, it, expect } from 'vitest';
import { calculateSolar, parseCurrency } from '../lib/solarCalculator';
import { slugify } from '../lib/projects/slug';
describe('calculadora FM SOLAR', () => {
  it('confere a simulação de R$ 2.000', () => {
    const r = calculateSolar(parseCurrency('R$ 2.000'));
    expect(r.economiaMensal).toBe(1600);
    expect(r.novaConta).toBe(400);
    expect(r.economiaAnual).toBe(19200);
    expect(r.consumoMensalKwh).toBe(2000);
    expect(r.potenciaKwp).toBe(12.1);
    expect(r.investimentoEstimado).toBeCloseTo(30193.13, 2);
    expect(r.paybackAnos).toBeCloseTo(1.5726, 3);
    expect(r.acumulado).toBeCloseTo(1403634.05, 0);
    expect(r.years).toHaveLength(25);
    expect(r.years[0].economia).toBe(19200);
    expect(r.years[1].economia).toBeCloseTo(20736);
    expect(r.years[24].acumulado).toBe(r.acumulado);
  });
  it.each(['650', '650,00', 'R$ 650,00'])('normaliza %s', (v) =>
    expect(parseCurrency(v)).toBe(650),
  );
  it.each(['', 'abc', 'Infinity', '-200', '1,2,3', '1.23', 'R$', 'NaN'])('rejeita %s', (v) =>
    expect(() => calculateSolar(parseCurrency(v))).toThrow(),
  );
  it.each([0, -1, Infinity, NaN])('rejeita número inválido %s', (v) =>
    expect(() => calculateSolar(v)).toThrow(),
  );
});
describe('slug', () => {
  it('normaliza acentos e símbolos', () =>
    expect(slugify('Sistema Fotovoltaico — Palmas / TO!')).toBe('sistema-fotovoltaico-palmas-to'));
  it('limita o comprimento sem hífen final', () => {
    const s = slugify('Energia Solar '.repeat(50));
    expect(s.length).toBeLessThanOrEqual(140);
    expect(s).not.toMatch(/-$/);
  });
});
