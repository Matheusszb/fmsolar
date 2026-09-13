'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectImage } from '@/lib/projects/types';
type Props = {
  projectId: string;
  images: ProjectImage[];
  setImages: (images: ProjectImage[]) => void;
  cover: string | null;
  setCover: (v: string | null) => void;
  before: string | null;
  setBefore: (v: string | null) => void;
  after: string | null;
  setAfter: (v: string | null) => void;
  setUploading: (v: boolean) => void;
  disabled: boolean;
  onBeforeUpload?: () => Promise<string | undefined>;
};
async function optimize(file: File) {
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
    file.size > 10485760 ||
    !file.size
  )
    throw Error(`${file.name}: use JPEG, PNG ou WebP de até 10 MB.`);
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw Error('Não foi possível otimizar a imagem.');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(Error('Imagem inválida.'))),
        'image/webp',
        0.86,
      ),
    );
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } finally {
    bitmap.close();
  }
}
function uploadFile(url: string, file: File, progress: (n: number) => void) {
  return new Promise<ProjectImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.timeout = 120000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) progress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(Error('Falha de rede ao enviar imagem.'));
    xhr.ontimeout = () => reject(Error('O envio demorou demais. Tente novamente.'));
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 400) reject(Error(data.error));
        else resolve(data);
      } catch {
        reject(Error('Resposta inválida ao enviar imagem.'));
      }
    };
    const form = new FormData();
    form.set('file', file);
    xhr.send(form);
  });
}
export function ImageManager(p: Props) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [target, setTarget] = useState<ProjectImage | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  async function upload(files: FileList | File[]) {
    if (busy || p.disabled) return;
    let projectId = p.projectId;
    if (!projectId && p.onBeforeUpload) {
      const draftId = await p.onBeforeUpload();
      if (!draftId) return;
      projectId = draftId;
    }
    setBusy(true);
    p.setUploading(true);
    let current = [...p.images];
    const errors: string[] = [];
    let sent = 0;
    try {
      for (const file of Array.from(files)) {
        setMsg(`Preparando ${file.name}...`);
        setProgress(0);
        try {
          const optimized = await optimize(file);
          const im = await uploadFile(
            `/api/admin/projects/${projectId}/images`,
            optimized,
            setProgress,
          );
          current = [...current, im];
          p.setImages(current);
          sent++;
          if (current.length === 1) p.setCover(im.id);
        } catch (e) {
          errors.push(e instanceof Error ? e.message : 'Erro ao enviar imagem.');
        }
      }
      setMsg(
        `${sent} imagem(ns) enviada(s). ${errors.join(' ')} Salve a obra para confirmar capa e organização.`,
      );
    } finally {
      setBusy(false);
      p.setUploading(false);
      if (input.current) input.current.value = '';
    }
  }
  function reorder(e: DragEndEvent) {
    if (e.over && e.active.id !== e.over.id)
      p.setImages(
        arrayMove(
          p.images,
          p.images.findIndex((i) => i.id === e.active.id),
          p.images.findIndex((i) => i.id === e.over!.id),
        ),
      );
  }
  return (
    <>
      <div
        className="upload-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void upload(e.dataTransfer.files);
        }}
      >
        <Upload size={30} />
        <strong>Selecione suas fotos ou arraste para cá</strong>
        <p>JPEG, PNG e WebP · Até 10 MB por foto · Otimização automática</p>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            if (e.target.files) void upload(e.target.files);
          }}
          disabled={busy || p.disabled}
          aria-label="Selecionar imagens"
        />
      </div>
      {busy && <progress max={100} value={progress} aria-label="Progresso do upload" />}
      <p role="status">{msg}</p>
      <p className="muted">
        Arraste pela alça para organizar, use as setas ou pressione espaço na alça e mova com o
        teclado. A ordem e as legendas são confirmadas ao salvar a obra.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorder}>
        <SortableContext items={p.images.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="image-manager-grid">
            {p.images.map((im, index) => (
              <SortablePhoto key={im.id} image={im} disabled={busy || p.disabled}>
                <div className="button-row">
                  <button
                    className={`button small ${p.cover === im.id ? 'gold' : 'light'}`}
                    type="button"
                    onClick={() => p.setCover(im.id)}
                  >
                    {p.cover === im.id ? 'Capa' : 'Definir como capa'}
                  </button>
                  <button
                    className="button small light"
                    type="button"
                    onClick={() => {
                      setTarget(im);
                      dialog.current?.showModal();
                    }}
                  >
                    Remover
                  </button>
                </div>
                <div className="button-row">
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Mover foto para trás"
                    disabled={index === 0}
                    onClick={() => p.setImages(arrayMove(p.images, index, index - 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Mover foto para frente"
                    disabled={index === p.images.length - 1}
                    onClick={() => p.setImages(arrayMove(p.images, index, index + 1))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <label className="field">
                  Texto alternativo
                  <input
                    maxLength={500}
                    value={im.alt_text}
                    onChange={(e) =>
                      p.setImages(
                        p.images.map((i) =>
                          i.id === im.id ? { ...i, alt_text: e.target.value } : i,
                        ),
                      )
                    }
                  />
                </label>
                <label className="field">
                  Legenda
                  <input
                    maxLength={1000}
                    value={im.caption}
                    onChange={(e) =>
                      p.setImages(
                        p.images.map((i) =>
                          i.id === im.id ? { ...i, caption: e.target.value } : i,
                        ),
                      )
                    }
                  />
                </label>
              </SortablePhoto>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {p.images.length > 0 && (
        <div className="form-grid">
          <label className="field">
            Foto antes
            <select value={p.before || ''} onChange={(e) => p.setBefore(e.target.value || null)}>
              <option value="">Não exibir</option>
              {p.images.map((im, i) => (
                <option value={im.id} key={im.id}>
                  Foto {i + 1} {im.caption}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Foto depois
            <select value={p.after || ''} onChange={(e) => p.setAfter(e.target.value || null)}>
              <option value="">Não exibir</option>
              {p.images.map((im, i) => (
                <option value={im.id} key={im.id}>
                  Foto {i + 1} {im.caption}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <dialog className="confirm-dialog" ref={dialog}>
        <h2>Remover imagem?</h2>
        <p>O arquivo será excluído do projeto. Esta ação não poderá ser desfeita.</p>
        <div className="button-row">
          <button
            type="button"
            className="button light"
            disabled={busy}
            onClick={() => dialog.current?.close()}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="button danger"
            disabled={busy}
            onClick={async () => {
              if (!target) return;
              setBusy(true);
              p.setUploading(true);
              try {
                const r = await fetch(`/api/admin/images/${target.id}`, { method: 'DELETE' });
                const d = await r.json();
                if (!r.ok) throw Error(d.error);
                p.setImages(p.images.filter((i) => i.id !== target.id));
                if (p.cover === target.id) p.setCover(null);
                if (p.before === target.id) p.setBefore(null);
                if (p.after === target.id) p.setAfter(null);
                setMsg('Imagem removida.');
                dialog.current?.close();
              } catch (e) {
                setMsg(e instanceof Error ? e.message : 'Erro ao remover imagem.');
              } finally {
                setBusy(false);
                p.setUploading(false);
              }
            }}
          >
            Remover definitivamente
          </button>
        </div>
      </dialog>
    </>
  );
}
function SortablePhoto({
  image,
  children,
  disabled,
}: {
  image: ProjectImage;
  children: React.ReactNode;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.id,
    disabled,
  });
  return (
    <fieldset
      disabled={disabled}
      ref={setNodeRef}
      className="managed-photo"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="managed-image">
        <Image
          src={image.url!}
          alt={image.alt_text || 'Foto enviada'}
          fill
          sizes="300px"
          unoptimized
        />
        <button
          type="button"
          className="drag-handle"
          aria-label="Arrastar para reordenar foto"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={21} />
        </button>
      </div>
      {children}
    </fieldset>
  );
}
