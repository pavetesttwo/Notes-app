'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">Your notes didn’t load</h1>
      <p className="text-muted-foreground">Your notes are safe. Try loading this page again.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-control bg-primary text-primary-foreground focus-visible:outline-ring min-h-11 px-5 font-medium transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Try again
      </button>
    </main>
  );
}
