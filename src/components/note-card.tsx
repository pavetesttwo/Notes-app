import type { Note } from '@/db/schema';

const updatedDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

type NoteCardProps = {
  note: Note;
  onEdit: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export function NoteCard({ note, onEdit, onTogglePin, onDelete }: NoteCardProps) {
  return (
    <article
      className={[
        'notes-enter group rounded-container bg-card flex min-h-52 flex-col border p-5',
        'shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md',
        note.pinned ? 'border-l-primary border-l-4' : 'border-border',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onEdit(note)}
          className="focus-visible:outline-ring min-h-11 min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label={`Edit ${note.title}`}
        >
          <h3 className="font-heading text-card-foreground text-lg leading-7 font-semibold text-balance break-words">
            {note.title}
          </h3>
        </button>
        <button
          type="button"
          onClick={() => onTogglePin(note)}
          aria-label={note.pinned ? `Unpin ${note.title}` : `Pin ${note.title}`}
          title={note.pinned ? 'Unpin note' : 'Pin note'}
          className={[
            'rounded-control hover:bg-muted focus-visible:outline-ring min-h-11 min-w-11',
            'transition focus-visible:outline-2',
            note.pinned ? 'text-primary' : 'text-muted-foreground',
          ].join(' ')}
        >
          <span aria-hidden="true">{note.pinned ? '◆' : '◇'}</span>
        </button>
      </div>
      <p className="text-muted-foreground mt-2 flex-1 text-base leading-6 text-pretty break-words whitespace-pre-wrap">
        {note.description || <span className="italic">No description</span>}
      </p>
      <div className="border-border mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <time dateTime={note.updatedAt} className="text-muted-foreground text-sm">
          Edited {updatedDate.format(new Date(note.updatedAt))}
        </time>
        <div
          className={[
            'flex items-center gap-1 opacity-100 transition sm:opacity-0',
            'sm:group-focus-within:opacity-100 sm:group-hover:opacity-100',
          ].join(' ')}
        >
          <button
            type="button"
            onClick={() => onEdit(note)}
            aria-label={`Edit ${note.title}`}
            className={[
              'rounded-control text-muted-foreground hover:bg-muted hover:text-foreground',
              'focus-visible:outline-ring min-h-11 px-3 text-sm font-medium transition',
              'focus-visible:outline-2',
            ].join(' ')}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(note)}
            aria-label={`Delete ${note.title}`}
            className={[
              'rounded-control text-destructive hover:bg-destructive/10 focus-visible:outline-ring',
              'min-h-11 px-3 text-sm font-medium transition focus-visible:outline-2',
            ].join(' ')}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
