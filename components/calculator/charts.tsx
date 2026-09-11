'use client';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import { calculateSolar, currency, decimal } from '@/lib/solarCalculator';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
export default function Charts({ result: r }: { result: ReturnType<typeof calculateSolar> }) {
  const reduced = useReducedMotion();
  const crossing = r.years.find((y) => y.acumulado >= r.investimentoEstimado)?.ano;
  return (
    <>
      <div className="chart-card">
        <span className="eyebrow dark">O TEMPO A FAVOR DO SEU INVESTIMENTO</span>
        <h3>
          Retorno do investimento — sistema de {decimal(r.potenciaKwp)} kWp (
          {currency(r.investimentoEstimado)}), payback em aproximadamente {Math.ceil(r.paybackAnos)}{' '}
          anos
        </h3>
        <p>Payback simples: {decimal(r.paybackAnos)} ano(s).</p>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={r.years} margin={{ top: 15, right: 12, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="ano" tickFormatter={(n) => `Ano ${n}`} minTickGap={30} />
              <YAxis
                width={64}
                tickFormatter={(n) => `${Math.round(n / 1000)} mil`}
                tick={{ fontSize: 10 }}
              />
              <Tooltip formatter={(v) => currency(Number(v))} labelFormatter={(v) => `Ano ${v}`} />
              <Area
                dataKey="acumulado"
                name="Economia acumulada"
                stroke="#b88a2c"
                fill="#dab35b"
                fillOpacity={0.22}
                isAnimationActive={!reduced}
                animationDuration={650}
              />
              <Line
                dataKey="investimento"
                name="Investimento"
                stroke="#192344"
                dot={false}
                strokeWidth={2}
                isAnimationActive={!reduced}
                animationDuration={650}
              />
              {crossing && (
                <ReferenceLine
                  x={crossing}
                  stroke="#12834b"
                  strokeDasharray="5 4"
                  label={{ value: 'Retorno', position: 'insideTopRight', fontSize: 10 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-key">
          <span>● Economia acumulada</span>
          <span>━ Investimento</span>
        </div>
      </div>
      <div className="chart-card">
        <h3>Sua conta: sem energia solar × com energia solar</h3>
        <div className="chart compact">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Hoje', valor: r.contaMensal, fill: '#192344' },
                { name: 'Com solar', valor: r.novaConta, fill: '#dab35b' },
              ]}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width={65} tickFormatter={(n) => currency(n)} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => currency(Number(v))} />
              <Bar
                dataKey="valor"
                name="Conta mensal"
                radius={[6, 6, 0, 0]}
                maxBarSize={95}
                isAnimationActive={!reduced}
                animationDuration={650}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
