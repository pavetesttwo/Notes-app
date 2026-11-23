const SKELETON_IDS = [
  'notes-loading-one',
  'notes-loading-two',
  'notes-loading-three',
  'notes-loading-four',
  'notes-loading-five',
  'notes-loading-six',
] as const;

export default function Loading() {
  return (
    <main
      className="mx-auto w-full max-w-6xl space-y-8 px-5 py-10 sm:px-8"
      role="status"
      aria-busy="true"
    >
      <div className="rounded-control bg-muted h-10 w-48 animate-pulse" />
      <div className="rounded-control bg-muted h-12 w-full animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKELETON_IDS.map((skeletonId) => (
          <div key={skeletonId} className="rounded-container bg-card h-48 animate-pulse" />
        ))}
      </div>
      <span className="sr-only">Loading notes</span>
    </main>
  );
}
