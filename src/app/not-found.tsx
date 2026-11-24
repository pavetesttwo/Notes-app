import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The Tic Tac Toe game is waiting on the home page.</p>
        <Link className="text-primary font-semibold underline" href="/">
          Go to the game
        </Link>
      </div>
    </main>
  );
}
