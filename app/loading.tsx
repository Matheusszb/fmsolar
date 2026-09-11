export default function Loading() {
  return (
    <div className="container loading-section" aria-label="Carregando" role="status">
      <div className="skeleton loading-title" />
      <div className="grid-3">
        {[1, 2, 3].map((i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}
