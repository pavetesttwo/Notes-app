type NotesHeaderProps = {
  query: string;
  notice: string;
  error: string;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
  onRetry: () => void;
};

export function NotesHeader({
  query,
  notice,
  error,
  onQueryChange,
  onCreate,
  onRetry,
}: NotesHeaderProps) {
  return (
    <>
      <a
        href="#main-content"
        className={[
          'focus:rounded-control focus:bg-card focus:outline-ring sr-only focus:not-sr-only',
          'focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-3 focus:outline-2',
        ].join(' ')}
      >
        Skip to content
      </a>
      <header className="notes-enter flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Your notes
          </h1>
          <p className="text-muted-foreground mt-2">A little space for everything on your mind.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className={[
            'rounded-control bg-primary text-primary-foreground focus-visible:outline-ring',
            'min-h-12 px-5 font-medium shadow-sm transition hover:opacity-90 focus-visible:outline-2',
            'focus-visible:outline-offset-2 active:scale-[0.98]',
          ].join(' ')}
        >
          <span aria-hidden="true" className="mr-2">
            ＋
          </span>
          New note
        </button>
      </header>
      <div className="mt-8">
        <label className="relative block">
          <span className="sr-only">Search notes by title or content</span>
          <span
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          >
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search notes by title or content…"
            className={[
              'rounded-container border-border bg-card placeholder:text-muted-foreground',
              'focus-visible:ring-ring min-h-12 w-full border pr-4 pl-11 text-base shadow-sm',
              'transition outline-none focus-visible:ring-2',
            ].join(' ')}
          />
        </label>
      </div>
      <div className="mt-6 space-y-3">
        {notice && (
          <p role="status" className="text-success">
            {notice}
          </p>
        )}
        {error && (
          <div
            role="alert"
            className={[
              'rounded-control border-destructive/30 bg-card text-destructive flex flex-wrap',
              'items-center justify-between gap-3 border p-4',
            ].join(' ')}
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-control focus-visible:outline-ring min-h-11 px-3 underline focus-visible:outline-2"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </>
  );
}
