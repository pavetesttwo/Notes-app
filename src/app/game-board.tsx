'use client';

import { GameGrid } from './game-grid';
import { useTicTacToe } from './use-tic-tac-toe';

export function GameBoard() {
  const { cells, nextMark, winningLine, winner, isDraw, isFinished, playCell, restartGame } =
    useTicTacToe();
  const status = winner ? `${winner} wins!` : isDraw ? "It's a draw!" : `${nextMark}'s turn`;

  return (
    <section className="w-full max-w-md" aria-label="Tic Tac Toe game">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-xl font-semibold tracking-tight" aria-live="polite">
          {status}
        </p>
        {!isFinished && (
          <div className="flex items-center gap-2" aria-label={`${nextMark} to play`}>
            <span
              className={`rounded-control grid size-10 place-items-center text-lg font-bold ${
                nextMark === 'X'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              aria-hidden="true"
            >
              X
            </span>
            <span
              className={`rounded-control grid size-10 place-items-center text-lg font-bold ${
                nextMark === 'O'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              aria-hidden="true"
            >
              O
            </span>
          </div>
        )}
      </div>

      <GameGrid
        cells={cells}
        winningLine={winningLine}
        isFinished={isFinished}
        onPlayCell={playCell}
      />

      <button
        type="button"
        onClick={restartGame}
        className="rounded-control bg-primary text-primary-foreground focus-visible:outline-ring mt-6 min-h-12 w-full px-5 text-base font-semibold transition duration-150 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-[0.98]"
      >
        {isFinished ? 'Play again' : 'Restart game'}
      </button>
    </section>
  );
}
