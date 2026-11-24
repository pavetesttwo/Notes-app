import { useState } from 'react';

export type Mark = 'X' | 'O';
export type Cell = Mark | null;

const WINNING_LINES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinningLine(cells: Cell[]): number[] | null {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    if (first === undefined || second === undefined || third === undefined) continue;

    const mark = cells[first];
    if (mark && mark === cells[second] && mark === cells[third]) {
      return [...line];
    }
  }

  return null;
}

export function useTicTacToe() {
  const [cells, setCells] = useState<Cell[]>(Array<Cell>(9).fill(null));
  const [nextMark, setNextMark] = useState<Mark>('X');
  const winningLine = getWinningLine(cells);
  const winner = winningLine ? (cells[winningLine[0] ?? 0] ?? null) : null;
  const isDraw = !winner && cells.every((cell) => cell !== null);
  const isFinished = winner !== null || isDraw;

  function playCell(index: number) {
    if (isFinished || cells[index] !== null) return;

    setCells((currentCells) =>
      currentCells.map((cell, cellIndex) => (cellIndex === index ? nextMark : cell))
    );
    setNextMark((currentMark) => (currentMark === 'X' ? 'O' : 'X'));
  }

  function restartGame() {
    setCells(Array<Cell>(9).fill(null));
    setNextMark('X');
  }

  return { cells, nextMark, winningLine, winner, isDraw, isFinished, playCell, restartGame };
}
