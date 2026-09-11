import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="conteudo" className="container section">
      <div className="empty-state">
        <span className="eyebrow dark">404 / FM SOLAR</span>
        <h1>Projeto não encontrado.</h1>
        <p>Esta página não existe ou o projeto ainda não está publicado.</p>
        <div className="button-row" style={{ justifyContent: 'center' }}>
          <Link href="/obras" className="button navy">
            Ver todas as obras
          </Link>
          <Link href="/" className="button light">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
