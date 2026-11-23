'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Note } from '@/db/schema';

type NoteEditorProps = {
  note: Note | null;
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onSave: (values: { title: string; description: string }) => Promise<void>;
};

export function NoteEditor({ note, open, pending, onClose, onSave }: NoteEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState(note?.title ?? '');
  const [description, setDescription] = useState(note?.description ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [note, open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await onSave({ title, description });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your note could not be saved.');
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="note-editor-title"
      className={[
        'rounded-container border-border bg-card text-card-foreground backdrop:bg-foreground/30',
        'm-auto w-[min(92vw,34rem)] border p-0 shadow-xl',
      ].join(' ')}
    >
      <form onSubmit={submit} className="space-y-5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="note-editor-title" className="font-heading text-2xl font-semibold">
              {note ? 'Edit note' : 'New note'}
            </h2>
            <p className="text-muted-foreground mt-1">A thought worth keeping.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close note editor"
            className={[
              'rounded-control text-muted-foreground hover:bg-muted focus-visible:outline-ring',
              'min-h-11 min-w-11 text-xl focus-visible:outline-2',
            ].join(' ')}
          >
            ×
          </button>
        </div>
        <label className="grid gap-2 font-medium">
          Title <span className="text-destructive">*</span>
          <input
            autoFocus
            required
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your note a title"
            className={[
              'rounded-control border-border bg-background focus-visible:ring-ring min-h-12',
              'border px-3 font-normal transition outline-none focus-visible:ring-2',
            ].join(' ')}
          />
        </label>
        <label className="grid gap-2 font-medium">
          Description
          <textarea
            rows={6}
            maxLength={10000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write down the details…"
            className={[
              'rounded-control border-border bg-background focus-visible:ring-ring resize-y',
              'border p-3 font-normal transition outline-none focus-visible:ring-2',
            ].join(' ')}
          />
        </label>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className={[
              'rounded-control hover:bg-muted focus-visible:outline-ring min-h-11 px-4',
              'font-medium transition focus-visible:outline-2',
            ].join(' ')}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending || !title.trim()}
            className={[
              'rounded-control bg-primary text-primary-foreground focus-visible:outline-ring',
              'min-h-11 px-5 font-medium transition hover:opacity-90 focus-visible:outline-2',
              'focus-visible:outline-offset-2 active:scale-[0.98] disabled:cursor-not-allowed',
              'disabled:opacity-60',
            ].join(' ')}
          >
            {pending ? 'Saving…' : note ? 'Save changes' : 'Create note'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
