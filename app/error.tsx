'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section">
      <div className="empty-state">
        <h2>Não foi possível carregar esta página.</h2>
        <p>Verifique sua conexão e tente novamente.</p>
        <button onClick={reset} className="button navy">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
