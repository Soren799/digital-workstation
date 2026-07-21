'use client';

import type { Bookmark } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { ExternalLink, FileText, Image, Trash2, Edit3 } from 'lucide-react';
import Link from 'next/link';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (b: Bookmark) => void;
  onDelete?: (b: Bookmark) => void;
}

const typeIcons = { link: ExternalLink, note: FileText, image: Image };

export function BookmarkCard({ bookmark, onEdit, onDelete }: BookmarkCardProps) {
  const TypeIcon = typeIcons[bookmark.type];

  const content = (
    <div
      className={cn(
        'group relative flex items-center gap-4 px-5 py-3 rounded-full',
        'glass hover:border-white/15 transition-all duration-200',
        'animate-fade-in'
      )}
    >
      {/* 类型图标 */}
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        <TypeIcon size={14} className="text-white/50" />
      </div>

      {/* 标题 + 描述 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white/80 line-clamp-1">{bookmark.title}</h3>
        {bookmark.description && (
          <p className="text-xs text-white/30 line-clamp-1 mt-0.5">{bookmark.description}</p>
        )}
      </div>

      {/* 标签 */}
      {bookmark.tags.length > 0 && (
        <div className="hidden sm:flex items-center gap-1">
          {bookmark.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-white/30">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 日期 */}
      <span className="hidden sm:block text-xs text-white/20 shrink-0">{formatDate(bookmark.created_at)}</span>

      {/* 操作按钮 */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => { e.preventDefault(); onEdit?.(bookmark); }}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <Edit3 size={12} className="text-white/40" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onDelete?.(bookmark); }}
          className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={12} className="text-red-400/60" />
        </button>
      </div>
    </div>
  );

  if (bookmark.type === 'link' && bookmark.url) {
    return (
      <Link href={bookmark.url} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }

  return content;
}
