'use client';

import { useEffect, useRef, useState } from 'react';
import type { Note } from '@/db/schema';

type DeleteNoteDialogProps = {
  note: Note | null;
  pending: boolean;
  onClose: () => void;
  onDelete: (note: Note) => Promise<void>;
};

export function DeleteNoteDialog({ note, pending, onClose, onDelete }: DeleteNoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      dialogRef.current?.showModal();
    } else if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [note]);

  async function confirmDelete() {
    if (!note) return;
    setError('');
    try {
      await onDelete(note);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The note could not be deleted.');
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="delete-note-title"
      className="rounded-container border-border bg-card text-card-foreground backdrop:bg-foreground/30 m-auto w-[min(92vw,28rem)] border p-0 shadow-xl"
    >
      <div className="space-y-5 p-6 sm:p-8">
        <div>
          <h2 id="delete-note-title" className="font-heading text-2xl font-semibold">
            Delete this note?
          </h2>
          <p className="text-muted-foreground mt-2">
            “{note?.title}” will be permanently removed. This can’t be undone.
          </p>
        </div>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-control hover:bg-muted focus-visible:outline-ring min-h-11 px-4 font-medium transition focus-visible:outline-2"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending || !note}
            onClick={confirmDelete}
            className="rounded-control bg-destructive text-destructive-foreground focus-visible:outline-ring min-h-11 px-5 font-medium transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? 'Deleting…' : 'Delete note'}
          </button>
        </div>
      </div>
    </dialog>
  );
}
