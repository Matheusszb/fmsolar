'use client';
import { useState, useMemo } from 'react';
import { AnimatedMoney } from './animated-money';
import { Ambient } from '@/components/ui/ambient';
import dynamic from 'next/dynamic';
import { Calculator as CalculatorIcon, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { calculateSolar, parseCurrency, currency, decimal } from '@/lib/solarCalculator';
import { whatsappUrl } from '@/config/company';
const Charts = dynamic(() => import('./charts'), {
  ssr: false,
  loading: () => <div className="skeleton" aria-label="Carregando gráficos" />,
});
export function Calculator({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [connection, setConnection] = useState('Monofásica');
  const [property, setProperty] = useState('Residencial');
  const result = useMemo(() => {
    try {
      return calculateSolar(parseCurrency(value));
    } catch {
      return null;
    }
  }, [value]);
  const lead = { connection, property };
  const [error, setError] = useState('');
  const message = result
    ? `Olá! Fiz uma simulação no site da FM SOLAR.\n\nConta média: ${currency(result.contaMensal)}\nTipo de ligação: ${lead.connection}\nTipo de imóvel: ${lead.property}\nSistema estimado: ${decimal(result.potenciaKwp)} kWp\nInvestimento estimado: ${currency(result.investimentoEstimado)}\n\nGostaria de receber uma análise técnica e um orçamento personalizado.`
    : undefined;
  return (
    <section className="section">
      <Ambient className="container calculator-layout">
        <aside>
          <form
            className="card calculator-form"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                calculateSolar(parseCurrency(value));
                setError('');
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Informe um valor válido.');
              }
            }}
          >
            <span className="card-icon">
              <CalculatorIcon />
            </span>
            <span className="eyebrow dark">SIMULE SEU FUTURO</span>
            <h2>Descubra quanto você pode economizar</h2>
            <p>Mova o controle ou informe sua conta. Veja sua economia em tempo real.</p>
            <label className="field">
              Valor médio da conta de luz (R$)
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
                placeholder="Ex.: 650"
                inputMode="decimal"
                required
                aria-invalid={!!error}
              />
            </label>
            <div className="solar-slider">
              <label htmlFor="bill-slider">
                Ajuste rápido da conta<span>{result ? currency(result.contaMensal) : 'R$ —'}</span>
              </label>
              <input
                id="bill-slider"
                aria-label="Ajuste rápido da conta"
                type="range"
                min={100}
                max={10000}
                step={50}
                value={Math.max(100, Math.min(10000, result?.contaMensal || 100))}
                style={{
                  background: `linear-gradient(90deg,#bd8b30 0%,#ecd494 ${Math.max(0, Math.min(100, (((result?.contaMensal || 100) - 100) / 9900) * 100))}%,#e4e8ef ${Math.max(0, Math.min(100, (((result?.contaMensal || 100) - 100) / 9900) * 100))}%)`,
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
              />
              <div>
                <span>R$ 100</span>
                <span>R$ 10.000</span>
              </div>
            </div>
            <label className="field">
              Tipo de ligação
              <select value={connection} onChange={(e) => setConnection(e.target.value)}>
                {['Monofásica', 'Bifásica', 'Trifásica'].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Tipo de imóvel
              <select value={property} onChange={(e) => setProperty(e.target.value)}>
                {['Residencial', 'Comercial', 'Rural'].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            <button className="button gold">
              Calcular Economia <ArrowUpRight size={18} />
            </button>
            <small>
              <ShieldCheck size={15} /> Sem compromisso. Sem cadastro.
            </small>
          </form>
          <div className="engineer-card">
            <h3>Quer o número exato para o seu telhado?</h3>
            <p>
              Nossos engenheiros fazem o dimensionamento real analisando sua conta e seu imóvel.
            </p>
            <a
              className="button green"
              href={whatsappUrl(message)}
              target="_blank"
              rel="noreferrer"
            >
              Quero um Orçamento Personalizado
            </a>
          </div>
        </aside>
        <div className="calculator-results">
          {!result ? (
            <div className="empty-state">
              <CalculatorIcon size={44} />
              <h2>Seu potencial de economia, em números.</h2>
              <p>
                Informe o valor da sua conta para ver seus números e os gráficos de retorno do
                investimento em tempo real.
              </p>
            </div>
          ) : (
            <>
              <div className="savings-grid">
                {[
                  [
                    'ECONOMIA MENSAL ESTIMADA',
                    result.economiaMensal,
                    'Todos os meses, mais liberdade.',
                  ],
                  [
                    'ECONOMIA ANUAL ESTIMADA',
                    result.economiaAnual,
                    'Economia estimada no primeiro ano.',
                  ],
                  [
                    'ACUMULADO EM 25 ANOS',
                    result.acumulado,
                    'Projeção com reajuste energético de 8% a.a.',
                  ],
                  ['REDUÇÃO NA CONTA', 'até 80%', `Nova conta ≈ ${currency(result.novaConta)}/mês`],
                  [
                    'INVESTIMENTO ESTIMADO',
                    result.investimentoEstimado,
                    `Sistema de ${decimal(result.potenciaKwp)} kWp`,
                  ],
                  ['CONTA ATUAL', result.contaMensal, 'Sua conta média antes da energia solar.'],
                ].map(([label, v, n], i) => (
                  <div className={`saving-card saving-${i}`} key={label}>
                    <span>{label}</span>
                    <strong>{typeof v === 'number' ? <AnimatedMoney value={v} /> : v}</strong>
                    <small>{n}</small>
                  </div>
                ))}
              </div>
              <Charts result={result} />
              <a
                className="button green exact-budget"
                href={whatsappUrl(message)}
                target="_blank"
                rel="noreferrer"
              >
                Quero Orçamento Exato no WhatsApp <ArrowUpRight size={18} />
              </a>
            </>
          )}
          <div className="notice">
            <strong>Importante sobre o valor estimado</strong>
            <p>
              Este valor é uma estimativa aproximada para fins de planejamento. O investimento exato
              pode variar conforme o tipo de estrutura, modelo dos equipamentos, tarifa aplicável,
              condições da instalação e dimensionamento técnico. Entre em contato para receber seu
              orçamento técnico personalizado com valores exatos.
            </p>
            <p>
              Premissas: tarifa de R$ 1,00/kWh, produção de 165 kWh/kWp por mês, custo de R$
              2.495,30/kWp e redução estimada de 80%. Payback simples; a projeção não desconta
              manutenção, degradação, financiamento ou valor do dinheiro no tempo.
            </p>
          </div>
        </div>
      </Ambient>
    </section>
  );
}
