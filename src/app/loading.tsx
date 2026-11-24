const LOADING_CELL_IDS = Array.from({ length: 9 }, (_, index) => `loading-cell-${index + 1}`);

export default function Loading() {
  return (
    <main
      className="grid min-h-screen place-items-center px-6"
      role="status"
      aria-label="Loading Tic Tac Toe"
    >
      <div className="grid w-full max-w-md grid-cols-3 gap-3" aria-hidden="true">
        {LOADING_CELL_IDS.map((cellId) => (
          <div key={cellId} className="rounded-container bg-muted aspect-square animate-pulse" />
        ))}
      </div>
    </main>
  );
}
