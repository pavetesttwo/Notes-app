import { GameBoard } from './game-board';

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md animate-[appear_220ms_ease-out_both] text-center">
        <h1 className="font-heading mb-8 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Tic Tac Toe
        </h1>
        <GameBoard />
      </div>
    </main>
  );
}
