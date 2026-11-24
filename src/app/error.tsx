'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">The game hit a snag</h1>
        <p className="text-muted-foreground">Try starting a fresh game.</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-control bg-primary text-primary-foreground focus-visible:outline-ring min-h-12 px-5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
