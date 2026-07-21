'use client';

import { useCallback, useState } from 'react';

interface RippleGridProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}

export function RippleGrid({ rows = 8, cols = 27, cellSize = 56, className = '' }: RippleGridProps) {
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);

  const handleCellClick = useCallback((row: number, col: number) => {
    setClickedCell({ row, col });
    setRippleKey(k => k + 1);
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
        key={`grid-${rippleKey}`}
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
                animation: clickedCell ? `cell-ripple ${duration} ease-out 1 ${delay}` : undefined,
                boxShadow: '0px 0px 40px 1px rgba(0,0,0,0.5) inset',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
