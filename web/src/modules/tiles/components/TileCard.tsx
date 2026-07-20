'use client';

import type { Tile } from '@/types';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import Link from 'next/link';

interface TileCardProps {
  tile: Tile;
  className?: string;
}

export function TileCard({ tile, className }: TileCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[tile.icon] || Icons.Folder;

  const content = (
    <div
      className={cn(
        'group relative rounded-xl border border-[rgb(var(--border))] overflow-hidden transition-all duration-200',
        'hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5',
        'animate-fade-in',
        className
      )}
      style={{ backgroundColor: `${tile.color}15` }}
    >
      {/* 顶部色条 */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: tile.color }}
      />

      {/* 内容 */}
      <div className="p-5 pt-6 h-full flex flex-col">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${tile.color}25` }}
        >
          <IconComponent size={20} style={{ color: tile.color }} />
        </div>
        <h3 className="font-semibold text-[rgb(var(--foreground))] mb-1 line-clamp-1">
          {tile.title}
        </h3>
        {tile.description && (
          <p className="text-sm text-[rgb(var(--muted-foreground))] line-clamp-2">
            {tile.description}
          </p>
        )}
        {/* hover 指示 */}
        <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-blue-400">打开 →</span>
        </div>
      </div>
    </div>
  );

  if (tile.link) {
    return <Link href={tile.link}>{content}</Link>;
  }

  return content;
}
