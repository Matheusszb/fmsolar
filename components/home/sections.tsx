import Link from 'next/link';
import { Counter } from './counter';
import {
  ShieldCheck,
  Ruler,
  FileCheck,
  BadgeCheck,
  House,
  Building2,
  Tractor,
  Wrench,
  MapPin,
  Phone,
  ArrowUpRight,
} from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { company, whatsappUrl } from '@/config/company';
export function FinalCTA() {
  return (
    <section className="final-cta">
      <span className="eyebrow" style={{ justifyContent: 'center' }}>
        UM NOVO CAPÍTULO PARA SUA ENERGIA
      </span>
      <h2>Sua economia começa com um bom projeto.</h2>
      <p>Receba uma análise personalizada para descobrir o sistema ideal para seu imóvel.</p>
      <a className="button gold" href={whatsappUrl()} target="_blank" rel="noreferrer">
        Solicitar análise gratuita <ArrowUpRight size={18} />
      </a>
    </section>
  );
}
export function HomeSections() {
  return (
    <>
      <section className="stats-strip">
        <div className="container stats-grid">
          {[
            ['+480', 'sistemas instalados'],
            ['+ de 1 MWp', 'potência entregue'],
            ['25 anos', 'de geração estimada'],
          ].map(([n, t]) => (
            <Reveal className="stat" key={t}>
              {n === '+480' ? (
                <Counter value={480} prefix="+" />
              ) : n === '25 anos' ? (
                <Counter value={25} suffix=" anos" />
              ) : (
                <strong>{n}</strong>
              )}
              <span>{t}</span>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section" id="diferenciais">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow dark">01 / ENGENHARIA QUE FAZ A DIFERENÇA</span>
              <h2>Diferenciais técnicos</h2>
              <p>Não vendemos apenas placas: entregamos engenharia responsável do início ao fim.</p>
            </div>
          </div>
          <div className="grid-4">
            {[
              [
                ShieldCheck,
                'Engenharia Especializada',
                'Time de engenheiros eletricistas responsável por cada projeto.',
              ],
              [
                Ruler,
                'Projetos Personalizados',
                'Dimensionamento sob medida para o seu consumo e telhado.',
              ],
              [
                FileCheck,
                'Homologação Rápida',
                'Cuidamos de toda a documentação junto à concessionária.',
              ],
              [
                BadgeCheck,
                'Garantia dos Equipamentos',
                'Módulos e inversores com garantia de fábrica e suporte local.',
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <Reveal className="card" key={String(title)}>
                  <span className="card-icon">
                    <I />
                  </span>
                  <h3>{String(title)}</h3>
                  <p>{String(desc)}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section services" id="servicos">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">02 / SOLUÇÕES PARA CADA REALIDADE</span>
              <h2>Nossos serviços</h2>
              <p>Seu consumo é único. Seu projeto também deve ser.</p>
            </div>
          </div>
          <div className="grid-4">
            {[
              [
                House,
                'Instalação Residencial',
                'Reduza até 85% da conta de luz da sua casa com sistema dimensionado.',
              ],
              [
                Building2,
                'Projetos Comerciais e Industriais',
                'Alta potência, análise de demanda e retorno acelerado.',
              ],
              [
                Tractor,
                'Sistemas para Zona Rural',
                'Bombeamento, irrigação e estruturas em solo para propriedades.',
              ],
              [
                Wrench,
                'Manutenção e Laudos Técnicos',
                'Inspeção termográfica, limpeza, ART e laudos de conformidade.',
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof House;
              return (
                <a
                  className="service-card"
                  href={whatsappUrl(`Olá! Tenho interesse em ${title}.`)}
                  target="_blank"
                  rel="noreferrer"
                  key={String(title)}
                >
                  <I size={29} />
                  <h3>{String(title)}</h3>
                  <p>{String(desc)}</p>
                  <span className="service-link">
                    Conversar sobre meu projeto <ArrowUpRight size={17} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section" id="como-funciona">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow dark">03 / CLAREZA EM CADA ETAPA</span>
              <h2>Passo a passo do seu projeto</h2>
            </div>
          </div>
          <div className="process">
            {[
              ['Vistoria Técnica', 'Avaliação do telhado, padrão de entrada e consumo.'],
              ['Engenharia e Projeto', 'Dimensionamento, memorial e diagramas assinados.'],
              ['Aprovação na Concessionária', 'Protocolo, acompanhamento e parecer de acesso.'],
              ['Instalação Final', 'Montagem, comissionamento e monitoramento do sistema.'],
            ].map(([t, d], i) => (
              <Reveal className="process-step" key={t}>
                <span className="step-number">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
export function HomeBottom() {
  return (
    <>
      <section className="section">
        <div className="container calculator-preview">
          <div>
            <span className="eyebrow dark">SEU PRÓXIMO INVESTIMENTO COMEÇA AQUI</span>
            <h2>Descubra quanto você pode economizar com energia solar</h2>
            <p>
              Informe o valor da sua conta e veja uma estimativa de economia, investimento e
              retorno.
            </p>
          </div>
          <form action="/calculadora" className="quick-form">
            <label className="field">
              Valor médio da conta de luz
              <input name="conta" placeholder="650" inputMode="decimal" required />
            </label>
            <button className="button navy">
              Calcular minha economia <ArrowUpRight size={18} />
            </button>
          </form>
        </div>
      </section>
      <section className="section white" id="clientes">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow dark">CONFIANÇA QUE SE RENOVA</span>
              <h2>O que dizem nossos clientes</h2>
            </div>
          </div>
          <div className="grid-3">
            {[
              [
                'Minha conta de luz era R$ 1.200, hoje pago praticamente só a taxa mínima. Melhor investimento que fiz na propriedade.',
                'José Alves',
                'Gurupi - TO',
              ],
              [
                'A FM SOLAR fez todo o projeto, homologação e instalou o sistema para irrigação. Atendimento técnico de verdade.',
                'Fazenda São João',
                'Porto Nacional - TO',
              ],
              [
                'Equipe pontual, projeto bem explicado e instalação limpa. Recomendo para quem quer energia solar com segurança.',
                'Maria Helena',
                'Palmas - TO',
              ],
            ].map(([q, n, l]) => (
              <Reveal className="card" key={n}>
                <span className="stars" aria-label="5 estrelas">
                  ★★★★★
                </span>
                <p className="quote">“{q}”</p>
                <div className="client-name">
                  <span className="avatar">
                    {n
                      .split(' ')
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <div>
                    <strong>{n}</strong>
                    <small>{l}</small>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="contato">
        <div className="container contact-grid">
          <div className="contact-card">
            <MapPin />
            <div>
              <h3>Atendimento regional</h3>
              <strong>Todo o território brasileiro</strong>
              <p>Atendimento em todo o território brasileiro.</p>
              <Link href="/obras" className="text-link">
                Conheça nossas obras <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="contact-card">
            <Phone />
            <div>
              <h3>Fale com um engenheiro</h3>
              <p>{company.phone}</p>
              <a className="button green" href={whatsappUrl()}>
                WhatsApp <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
