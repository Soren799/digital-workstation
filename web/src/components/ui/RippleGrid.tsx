'use client';

import { useCallback, useState } from 'react';

interface RippleGridProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}

export function RippleGrid({ rows = 6, cols = 20, cellSize = 60, className = '' }: RippleGridProps) {
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = useCallback((row: number, col: number) => {
    setClickedCell({ row, col });
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)',
      }}
    >
      <div
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gridTemplateRows: `repeat(${rows}, ${cellSize}px)` }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const distance = clickedCell
            ? Math.hypot(clickedCell.row - row, clickedCell.col - col)
            : 0;
          const delay = `${distance * 55}ms`;
          const duration = `${200 + distance * 80}ms`;

          return (
            <div
              key={i}
              onClick={() => handleCellClick(row, col)}
              className="border-[0.5px] border-white/[0.12] cursor-pointer transition-all duration-200 hover:!opacity-100 hover:bg-white/[0.06]"
              style={{
                width: cellSize,
                height: cellSize,
                opacity: 0.55,
                animationName: clickedCell ? 'cell-ripple' : 'none',
                animationDuration: duration,
                animationTimingFunction: 'ease-out',
                animationIterationCount: '1',
                animationDelay: delay,
                boxShadow: '0px 0px 40px 1px rgba(0,0,0,0.5) inset',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
