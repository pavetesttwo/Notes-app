import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">Note not found</h1>
      <p className="text-muted-foreground">It may have been deleted or moved.</p>
      <Link className="rounded-control text-primary min-h-11 px-4 py-2 underline" href="/">
        Return to your notes
      </Link>
    </main>
  );
}
