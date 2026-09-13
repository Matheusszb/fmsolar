'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categories, states, type Project, type ProjectImage } from '@/lib/projects/types';
import { slugify } from '@/lib/projects/slug';
import { projectSchema, type ProjectInput } from '@/lib/projects/validators';
import { ImageManager } from './image-manager';
export const technicalFields = [
  ['power_kwp', 'Potência instalada em kWp'],
  ['modules_count', 'Quantidade de módulos'],
  ['module_model', 'Modelo dos módulos'],
  ['module_power_w', 'Potência por módulo em W'],
  ['inverters_count', 'Quantidade de inversores'],
  ['inverter_model', 'Modelo do inversor'],
  ['estimated_monthly_generation', 'Geração mensal estimada em kWh'],
  ['estimated_monthly_savings', 'Economia mensal estimada em R$'],
  ['estimated_annual_savings', 'Economia anual estimada em R$'],
  ['estimated_reduction_percentage', 'Percentual estimado de redução da conta'],
] as const;
const numericFields = new Set<string>(
  technicalFields.filter(([k]) => !k.endsWith('model')).map(([k]) => k),
);
export function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id);
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [customSlug, setCustomSlug] = useState(!!initial);
  const [images, setImages] = useState<ProjectImage[]>(initial?.project_images || []);
  const [cover, setCover] = useState(initial?.cover_image || null);
  const [before, setBefore] = useState(initial?.before_image || null);
  const [after, setAfter] = useState(initial?.after_image || null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty || uploading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const links = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        dirty &&
        target &&
        target.target !== '_blank' &&
        !window.confirm('Existem alterações não salvas. Deseja sair?')
      )
        e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    document.addEventListener('click', links, true);
    return () => {
      window.removeEventListener('beforeunload', warn);
      document.removeEventListener('click', links, true);
    };
  }, [dirty, uploading]);
  async function save(status: 'draft' | 'published'): Promise<string | undefined> {
    if (busy || uploading) return undefined;
    setBusy(true);
    setError('');
    setMsg('');
    try {
      const f = new FormData(form.current!);
      const raw: Record<string, unknown> = {};
      for (const key of [
        'title',
        'slug',
        'summary',
        'description',
        'category',
        'city',
        'state',
        'challenge',
        'solution',
        'results',
      ])
        raw[key] = String(f.get(key) || '');
      for (const [key] of technicalFields) {
        const v = String(f.get(key) || '').trim();
        raw[key] = numericFields.has(key) ? (v === '' ? null : Number(v.replace(',', '.'))) : v;
      }
      raw.completion_date = f.get('completion_date') || null;
      raw.featured = f.get('featured') === 'on';
      raw.status = status;
      const parsed = projectSchema.safeParse(raw);
      if (!parsed.success) throw Error(parsed.error.issues.map((i) => i.message).join(' '));
      const input: ProjectInput = parsed.data;
      const r = await fetch(id ? `/api/admin/projects/${id}` : '/api/admin/projects', {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          id
            ? {
                project: input,
                gallery: {
                  images: images.map((im, i) => ({
                    id: im.id,
                    alt_text: im.alt_text,
                    caption: im.caption,
                    sort_order: i,
                  })),
                  cover,
                  before,
                  after,
                },
              }
            : input,
        ),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      const savedId = data.id as string;
      setId(savedId);
      setDirty(false);
      setMsg(status === 'published' ? 'Obra publicada com sucesso.' : 'Obra salva com sucesso.');
      if (!id) {
        router.replace(`/admin/obras/${savedId}/editar`);
      }
      router.refresh();
      return savedId;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow dark">PORTFÓLIO / {initial ? 'EDIÇÃO' : 'CADASTRO'}</span>
          <h1>{initial ? 'Editar obra' : 'Nova obra'}</h1>
          <p>
            {initial
              ? `Última atualização: ${new Date(initial.updated_at).toLocaleString('pt-BR')}`
              : 'Conte a história de mais um projeto que transforma energia.'}
          </p>
        </div>
        {id && (
          <Link target="_blank" className="button light" href={`/admin/obras/${id}/previa`}>
            Visualizar prévia
          </Link>
        )}
      </div>
      <form
        ref={form}
        onChange={() => setDirty(true)}
        onSubmit={(e) => {
          e.preventDefault();
          void save('draft');
        }}
      >
        <fieldset disabled={busy || uploading} className="editor-fieldset">
          <section className="card form-section">
            <span className="eyebrow dark">01 / INFORMAÇÕES PRINCIPAIS</span>
            <h2>Apresente o projeto</h2>
            <div className="form-grid">
              <label className="field full">
                Título *
                <input
                  name="title"
                  value={title}
                  required
                  maxLength={180}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!customSlug) setSlug(slugify(e.target.value));
                  }}
                />
              </label>
              <label className="field">
                Slug
                <input
                  name="slug"
                  value={slug}
                  maxLength={160}
                  onChange={(e) => {
                    setCustomSlug(true);
                    setSlug(e.target.value);
                  }}
                />
                <small>Endereço único da obra. Use letras minúsculas e hífens.</small>
              </label>
              <label className="field">
                Categoria
                <select name="category" defaultValue={initial?.category || 'residential'}>
                  {Object.entries(categories).map(([v, l]) => (
                    <option value={v} key={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field full">
                Resumo
                <textarea name="summary" maxLength={500} defaultValue={initial?.summary} />
              </label>
              <label className="field full">
                Descrição completa
                <textarea
                  name="description"
                  maxLength={30000}
                  rows={6}
                  defaultValue={initial?.description}
                />
              </label>
            </div>
          </section>
          <section className="card form-section">
            <span className="eyebrow dark">02 / LOCALIZAÇÃO</span>
            <h2>Onde a energia acontece</h2>
            <div className="form-grid">
              <label className="field">
                Cidade
                <input name="city" maxLength={120} defaultValue={initial?.city} />
              </label>
              <label className="field">
                Estado
                <select name="state" defaultValue={initial?.state || ''}>
                  <option value="">Selecione a UF</option>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>
          <section className="card form-section">
            <span className="eyebrow dark">03 / ENGENHARIA</span>
            <h2>Dados técnicos</h2>
            <div className="form-grid">
              {technicalFields.map(([key, label]) => (
                <label className="field" key={key}>
                  {label}
                  <input
                    name={key}
                    inputMode={numericFields.has(key) ? 'decimal' : undefined}
                    defaultValue={initial?.[key] ?? ''}
                  />
                </label>
              ))}
              <label className="field">
                Data de conclusão
                <input
                  type="date"
                  name="completion_date"
                  defaultValue={initial?.completion_date || ''}
                />
              </label>
            </div>
          </section>
          <section className="card form-section">
            <span className="eyebrow dark">04 / O CASE</span>
            <h2>Da necessidade ao resultado</h2>
            <div className="form-grid">
              {[
                ['challenge', 'Desafio'],
                ['solution', 'Solução aplicada'],
                ['results', 'Resultados'],
              ].map(([k, l]) => (
                <label className="field full" key={k}>
                  {l}
                  <textarea
                    name={k}
                    maxLength={10000}
                    defaultValue={initial?.[k as 'challenge' | 'solution' | 'results']}
                  />
                </label>
              ))}
            </div>
          </section>
        </fieldset>
        <section className="card form-section">
          <span className="eyebrow dark">05 / GALERIA</span>
          <h2>Imagens que contam a história</h2>
          {id ? (
            <ImageManager
              projectId={id}
              images={images}
              setImages={(v) => {
                setImages(v);
                setDirty(true);
              }}
              cover={cover}
              setCover={(v) => {
                setCover(v);
                setDirty(true);
              }}
              before={before}
              setBefore={(v) => {
                setBefore(v);
                setDirty(true);
              }}
              after={after}
              setAfter={(v) => {
                setAfter(v);
                setDirty(true);
              }}
              setUploading={setUploading}
              disabled={busy}
              onBeforeUpload={async () => {
                if (id) return id;
                const titleValue = String(new FormData(form.current!).get('title') || '').trim();
                if (titleValue.length < 3) {
                  setError('Informe um título com pelo menos 3 caracteres antes de enviar fotos.');
                  return undefined;
                }
                return save('draft');
              }}
            />
          ) : (
            <div className="notice">
              Salve a obra como rascunho para começar a enviar as fotos. Seus dados serão
              preservados.
            </div>
          )}
        </section>
        <section className="card form-section">
          <span className="eyebrow dark">06 / PUBLICAÇÃO</span>
          <h2>Pronta para ser vista?</h2>
          <label className="checkbox">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initial?.featured}
              disabled={busy || uploading}
            />
            Destacar esta obra na página inicial
          </label>
          <p>
            Publicar exige título, slug, resumo, cidade e estado. Campos técnicos e seções vazias
            não aparecem no site.
          </p>
        </section>
        <div className="save-bar">
          <span role="status">
            {busy
              ? 'Salvando...'
              : uploading
                ? 'Enviando imagens...'
                : dirty
                  ? 'Alterações não salvas'
                  : msg || 'Salvo'}
          </span>
          <div className="button-row">
            <button type="submit" className="button light" disabled={busy || uploading}>
              Salvar como rascunho
            </button>
            <button
              type="button"
              className="button gold"
              disabled={busy || uploading}
              onClick={() => save('published')}
            >
              Publicar obra
            </button>
          </div>
        </div>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        {msg && (
          <div className="success-message" role="status">
            {msg}
          </div>
        )}
      </form>
    </>
  );
}
