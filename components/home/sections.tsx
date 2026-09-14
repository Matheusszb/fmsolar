import Link from 'next/link';
import Image from 'next/image';
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
  Leaf,
  TrendingDown,
  ChartNoAxesCombined,
  Zap,
  Smartphone,
  HardHat,
  Settings2,
  PiggyBank,
} from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Ambient, ParallaxPhoto } from '@/components/ui/ambient';
import { company, whatsappUrl } from '@/config/company';
import { Counter } from './counter';
import { Timeline } from './timeline';
import { Testimonials } from './testimonials';
import { FAQ } from './faq';
const differentials = [
  {
    Icon: ShieldCheck,
    title: 'Engenharia Especializada',
    description: 'Time de engenheiros eletricistas responsável por cada projeto.',
  },
  {
    Icon: Ruler,
    title: 'Projetos Personalizados',
    description: 'Dimensionamento sob medida para o seu consumo e telhado.',
  },
  {
    Icon: FileCheck,
    title: 'Homologação Rápida',
    description: 'Cuidamos de toda a documentação junto à concessionária.',
  },
  {
    Icon: BadgeCheck,
    title: 'Garantia dos Equipamentos',
    description: 'Módulos e inversores com garantia de fábrica e suporte local.',
  },
];
const services = [
  {
    Icon: House,
    title: 'Instalação Residencial',
    description: 'Reduza até 85% da conta de luz da sua casa com sistema dimensionado.',
    image: '/solar-hero.jpg',
  },
  {
    Icon: Building2,
    title: 'Projetos Comerciais e Industriais',
    description: 'Alta potência, análise de demanda e retorno acelerado.',
    image: '/images/solar-aerial.webp',
  },
  {
    Icon: Tractor,
    title: 'Sistemas para Zona Rural',
    description: 'Bombeamento, irrigação e estruturas em solo para propriedades.',
    image: '/images/solar-field.webp',
  },
  {
    Icon: Wrench,
    title: 'Manutenção e Laudos Técnicos',
    description: 'Inspeção termográfica, limpeza, ART e laudos de conformidade.',
    image: '/solar-hero.jpg',
  },
];
export function FinalCTA() {
  return (
    <section className="final-cta">
      <ParallaxPhoto />
      <Ambient className="final-cta-inner">
        <div className="cta-light" aria-hidden="true" />
        <Reveal>
          <span className="eyebrow">O FUTURO É SOLAR. E PODE SER SEU.</span>
          <h2>Sua conta de energia não precisa continuar aumentando.</h2>
          <p>
            Sua economia começa com um bom projeto. Receba uma análise personalizada para descobrir
            o sistema ideal para seu imóvel.
          </p>
          <a className="button gold" href={whatsappUrl()} target="_blank" rel="noreferrer">
            Solicitar análise gratuita <ArrowUpRight size={19} />
          </a>
          <span className="cta-assurance">
            <ShieldCheck size={16} /> Engenharia responsável, do início ao fim.
          </span>
        </Reveal>
      </Ambient>
    </section>
  );
}
export function HomeSections() {
  return (
    <>
      <section className="stats-strip">
        <div className="container stats-grid">
          {[
            { value: 480, prefix: '+', suffix: '', label: 'sistemas instalados' },
            { value: 1, prefix: '+ de ', suffix: ' MWp', label: 'potência entregue' },
            { value: 85, prefix: 'até ', suffix: '%', label: 'de economia potencial*' },
            { value: 25, prefix: '', suffix: ' anos', label: 'de geração estimada' },
          ].map((s, i) => (
            <Reveal className="stat" delay={i * 0.08} key={s.label}>
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section benefits-section">
        <div className="container benefits-layout">
          <Reveal className="benefits-intro" variant="side">
            <span className="eyebrow dark">UMA ESCOLHA INTELIGENTE. TODOS OS DIAS.</span>
            <h2>
              Mais que economia.
              <br />
              <span>
                Uma nova relação
                <br />
                {' '}com a energia.
              </span>
            </h2>
            <p>Transforme a luz que chega ao seu imóvel em possibilidades para o seu futuro.</p>
            <Link href="/calculadora" className="text-link">
              Explore seu potencial de economia <ArrowUpRight size={19} />
            </Link>
          </Reveal>
          <div className="benefit-list">
            {[
              {
                Icon: TrendingDown,
                title: 'Redução da conta',
                text: 'Menos gastos com energia, mais espaço para seus planos.',
              },
              {
                Icon: House,
                title: 'Valorização do imóvel',
                text: 'Tecnologia e infraestrutura energética incorporadas ao seu patrimônio.',
              },
              {
                Icon: Leaf,
                title: 'Energia limpa',
                text: 'Aproveite uma fonte renovável disponível todos os dias.',
              },
              {
                Icon: ChartNoAxesCombined,
                title: 'Mais previsibilidade',
                text: 'Planeje sua energia com um sistema dimensionado para seu consumo.',
              },
              {
                Icon: ShieldCheck,
                title: 'Garantia e suporte',
                text: 'Equipamentos com garantia de fábrica e acompanhamento técnico.',
              },
              {
                Icon: Zap,
                title: 'Independência energética',
                text: 'Tenha mais controle sobre seus custos e sua geração de energia',
              },
              {
                Icon: Smartphone,
                title: 'Monitoramento em tempo real',
                text: 'Acompanhe a geração e o desempenho do seu sistema pelo celular.',
              },
              {
                Icon: HardHat,
                title: 'Instalação segura e profissional',
                text: 'Projeto, instalação e comissionamento seguindo critérios técnicos e de segurança.',
              },
              {
                Icon: Settings2,
                title: 'Baixa manutenção',
                text: 'Sistema desenvolvido para operar por muitos anos com manutenção preventiva simplificada.',
              },
              {
                Icon: PiggyBank,
                title: 'Retorno sobre o investimento',
                text: 'Transforme parte do gasto mensal com energia em um investimento de médio e longo prazo.',
              },
            ].map(({ Icon, title, text }, i) => (
              <Reveal className="benefit-row" delay={i * 0.065} key={title}>
                <span className="benefit-number">0{i + 1}</span>
                <Icon size={22} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <ArrowUpRight className="benefit-arrow" size={20} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section differentials-section" id="diferenciais">
        <div className="technical-grid" aria-hidden="true" />
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">01 / ENGENHARIA QUE FAZ A DIFERENÇA</span>
              <h2>Diferenciais técnicos</h2>
            </div>
            <p>Não vendemos apenas placas: entregamos engenharia responsável do início ao fim.</p>
          </Reveal>
          <div className="grid-4">
            {differentials.map(({ Icon, title, description }, i) => (
              <Reveal className="card differential-card" delay={i * 0.09} key={title}>
                <span className="differential-index">0{i + 1}</span>
                <span className="card-icon">
                  <Icon size={27} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="card-rule" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section partners-section" id="marcas-parceiras">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow dark">04 / PARCERIAS DE CONFIANÇA</span>
              <h2>Marcas parceiras</h2>
            </div>
            <p>Trabalhamos com fabricantes reconhecidos para entregar soluções seguras e eficientes.</p>
          </Reveal>
          <div className="partners-grid">
            {[
              ['Microinversores', 'Hoymiles · GoodWe · Deye'],
              ['Módulos fotovoltaicos (painéis solares)', 'Gokin Solar · Jinko Solar · JA Solar · Risen Energy · Ronma Solar · TSUN · Trina Solar · LONGi Solar · Maxeon · DMEGC Solar · TCL Solar · Astronergy'],
              ['Inversores híbridos', 'Deye · Huawei · Sungrow · Solis · GoodWe · MUST · Solplanet'],
              ['Inversores off-grid', 'MUST'],
            ].map(([category, brands], i) => (
              <Reveal className="partner-card" delay={i * 0.08} key={category}>
                <span className="partner-index">0{i + 1}</span>
                <h3>{category}</h3>
                <p>{brands}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section services" id="servicos">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow dark">02 / SOLUÇÕES PARA CADA REALIDADE</span>
              <h2>Nossos serviços</h2>
            </div>
            <p>
              Seu consumo é único.
              <br />
              Seu projeto também deve ser.
            </p>
          </Reveal>
          <div className="grid-4 services-grid">
            {services.map(({ Icon, title, description, image }, i) => (
              <Reveal variant="image" delay={i * 0.07} key={title}>
                <a
                  className={`service-card service-photo service-${i}`}
                  href={whatsappUrl(`Olá! Tenho interesse em ${title}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width:600px) 100vw,(max-width:1000px) 50vw,25vw"
                    unoptimized
                  />
                  <span className="service-overlay" />
                  <span className="service-top">
                    <span>0{i + 1}</span>
                    <Icon size={26} />
                  </span>
                  <div className="service-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span className="service-link">
                      Vamos conversar <ArrowUpRight size={20} />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="image-disclaimer">
            Imagens ilustrativas. Conheça as instalações da FM SOLAR em{' '}
            <Link href="/obras">nossas obras</Link>.
          </p>
        </div>
      </section>
      <section className="section process-section" id="como-funciona">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow dark">03 / DA PRIMEIRA CONVERSA À GERAÇÃO</span>
              <h2>Passo a passo do seu projeto</h2>
            </div>
            <p>
              Uma jornada simples para você.
              <br />
              Engenharia precisa em cada etapa.
            </p>
          </Reveal>
          <Timeline />
        </div>
      </section>
    </>
  );
}
export function HomeBottom() {
  return (
    <>
      <section className="section quick-calculator-section">
        <Ambient className="container calculator-preview">
          <Reveal variant="side">
            <span className="eyebrow">SEU PRÓXIMO INVESTIMENTO COMEÇA AQUI</span>
            <h2>Sua liberdade energética começa aqui: transforme sua conta de luz em investimento.</h2>
            <p>
              Insira o valor da sua fatura e confira na hora a economia estimada, o investimento e o
              tempo de retorno.
            </p>
            <span className="calculator-decor" aria-hidden="true">
              85<small>%</small>
            </span>
          </Reveal>
          <Reveal className="quick-form-shell" delay={0.15}>
            <form action="/calculadora" className="quick-form">
              <span className="eyebrow dark">O SOL TRABALHA. VOCÊ ECONOMIZA.</span>
              <label className="field">
                Valor médio da conta de luz
                <div className="quick-input">
                  <span>R$</span>
                  <input name="conta" placeholder="650" inputMode="decimal" required />
                </div>
              </label>
              <button className="button gold">
                Calcular minha economia <ArrowUpRight size={19} />
              </button>
              <small>Uma estimativa em segundos. Sem cadastro.</small>
            </form>
          </Reveal>
        </Ambient>
      </section>
      <section className="section white" id="clientes">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow dark">QUEM ESCOLHEU UM FUTURO SOLAR</span>
              <h2>O que dizem nossos clientes</h2>
            </div>
          </Reveal>
          <Testimonials />
        </div>
      </section>
      <section className="section faq-section" id="duvidas">
        <div className="container faq-layout">
          <Reveal variant="side">
            <span className="eyebrow dark">CLAREZA PARA DECIDIR</span>
            <h2>
              Boas perguntas.
              <br />
              Respostas claras.
            </h2>
            <p>Entenda o próximo passo para gerar sua própria energia.</p>
            <a className="text-link" href={whatsappUrl()}>
              Fale com um engenheiro <ArrowUpRight size={18} />
            </a>
          </Reveal>
          <FAQ />
        </div>
      </section>
      <section className="section contact-section" id="contato">
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
