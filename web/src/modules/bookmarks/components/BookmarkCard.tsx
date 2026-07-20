'use client';

import type { Bookmark } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, FileText, Image, Trash2, Edit3 } from 'lucide-react';
import Link from 'next/link';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (b: Bookmark) => void;
  onDelete?: (b: Bookmark) => void;
}

const typeIcons = {
  link: ExternalLink,
  note: FileText,
  image: Image,
};

const typeLabels = {
  link: '链接',
  note: '笔记',
  image: '图片',
};

export function BookmarkCard({ bookmark, onEdit, onDelete }: BookmarkCardProps) {
  const TypeIcon = typeIcons[bookmark.type];

  const content = (
    <div
      className={cn(
        'group relative p-5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]',
        'hover:border-blue-500/30 hover:shadow-md transition-all duration-200',
        'animate-fade-in'
      )}
    >
      {/* 操作按钮 */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.preventDefault(); onEdit?.(bookmark); }}
          className="p-1.5 rounded-lg hover:bg-[rgb(var(--muted))] transition-colors"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onDelete?.(bookmark); }}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 类型图标 */}
      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
        <TypeIcon size={16} className="text-blue-400" />
      </div>

      {/* 标题 */}
      <h3 className="font-semibold text-[rgb(var(--foreground))] mb-1 line-clamp-1">
        {bookmark.title}
      </h3>

      {/* 描述 */}
      {bookmark.description && (
        <p className="text-sm text-[rgb(var(--muted-foreground))] line-clamp-2 mb-3">
          {bookmark.description}
        </p>
      )}

      {/* 标签 */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bookmark.tags.map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-[rgb(var(--muted-foreground))]">
        <Badge variant="blue">{typeLabels[bookmark.type]}</Badge>
        <span>{formatDate(bookmark.created_at)}</span>
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
