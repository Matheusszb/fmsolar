import { Calculator } from '@/components/calculator/calculator';
export const metadata = {
  title: 'Calculadora de Economia Solar',
  alternates: { canonical: '/calculadora' },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ conta?: string }>;
}) {
  const { conta } = await searchParams;
  return (
    <>
      <section className="page-heading">
        <div className="container">
          <span className="eyebrow">MENOS CONTA. MAIS POSSIBILIDADES.</span>
          <h1>Calculadora de economia solar</h1>
          <p>
            Informe os dados da sua conta de luz e veja quanto você deixa de pagar por ano e ao
            longo de 25 anos.
          </p>
        </div>
      </section>
      <Calculator initial={conta || ''} />
    </>
  );
}
