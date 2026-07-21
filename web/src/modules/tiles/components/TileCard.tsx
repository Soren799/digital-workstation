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
        'group relative rounded-2xl overflow-hidden transition-all duration-300',
        'glass',
        'hover:border-white/20 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5',
        'animate-fade-in',
        className
      )}
    >
      {/* 颜色光晕 */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${tile.color}40, transparent 70%)`,
        }}
      />
      {/* 顶部色条 */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-b-full"
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
