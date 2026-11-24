import type { Cell } from './use-tic-tac-toe';

const CELL_IDS = Array.from({ length: 9 }, (_, index) => `game-cell-${index + 1}`);

type GameGridProps = {
  cells: Cell[];
  winningLine: number[] | null;
  isFinished: boolean;
  onPlayCell: (index: number) => void;
};

export function GameGrid({ cells, winningLine, isFinished, onPlayCell }: GameGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3" role="group" aria-label="Game board">
      {CELL_IDS.map((cellId, index) => {
        const cell = cells[index] ?? null;
        const isWinningCell = winningLine?.includes(index) ?? false;
        return (
          <button
            key={cellId}
            type="button"
            aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}${cell ? `, ${cell}` : ', empty'}`}
            aria-disabled={cell !== null || isFinished}
            onClick={() => onPlayCell(index)}
            className={`rounded-container hover:border-primary/70 hover:bg-card focus-visible:outline-ring aspect-square min-h-20 border-2 text-5xl font-bold shadow-sm transition duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-[0.98] sm:text-6xl ${
              isWinningCell
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground'
            } ${cell === 'O' ? 'text-accent' : ''}`}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
