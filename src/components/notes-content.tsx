import type { Note } from '@/db/schema';
import { NoteCard } from './note-card';

const SKELETON_IDS = [
  'notes-content-skeleton-one',
  'notes-content-skeleton-two',
  'notes-content-skeleton-three',
  'notes-content-skeleton-four',
  'notes-content-skeleton-five',
  'notes-content-skeleton-six',
] as const;

type NotesContentProps = {
  notes: Note[];
  loading: boolean;
  searching: boolean;
  pinnedNotes: Note[];
  otherNotes: Note[];
  onCreate: () => void;
  onEdit: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export function NotesContent({
  notes,
  loading,
  searching,
  pinnedNotes,
  otherNotes,
  onCreate,
  onEdit,
  onTogglePin,
  onDelete,
}: NotesContentProps) {
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading notes"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SKELETON_IDS.map((skeletonId) => (
          <div key={skeletonId} className="rounded-container bg-muted h-52 animate-pulse" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="notes-enter rounded-container border-border bg-card/60 mt-14 border border-dashed px-6 py-14 text-center">
        <span aria-hidden="true" className="text-primary text-4xl">
          ✳
        </span>
        <h2 className="font-heading mt-4 text-xl font-semibold">
          {searching ? 'No notes found' : 'Your first note starts here'}
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md">
          {searching
            ? 'Try a different title or phrase.'
            : 'Capture ideas, plans, and little reminders as they come to you.'}
        </p>
        {!searching && (
          <button
            type="button"
            onClick={onCreate}
            className="rounded-control text-primary focus-visible:outline-ring mt-5 min-h-11 px-4 font-medium underline focus-visible:outline-2"
          >
            Create your first note
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-9 space-y-9">
      {pinnedNotes.length > 0 && (
        <section aria-labelledby="pinned-heading">
          <h2 id="pinned-heading" className="font-heading mb-4 text-lg font-semibold">
            Pinned
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}
      {otherNotes.length > 0 && (
        <section aria-labelledby="all-notes-heading">
          {pinnedNotes.length > 0 && (
            <h2 id="all-notes-heading" className="font-heading mb-4 text-lg font-semibold">
              Others
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
