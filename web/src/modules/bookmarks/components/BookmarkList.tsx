'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookmarkCard } from './BookmarkCard';
import { BookmarkEditor } from './BookmarkEditor';
import { Button } from '@/components/ui/Button';
import { useAdmin } from '@/hooks/useAdmin';
import { createClient } from '@/lib/supabase/client';
import type { Bookmark, BookmarkType } from '@/types';
import { Plus, Search, Loader2, Folders } from 'lucide-react';

export function BookmarkList() {
  const { isAdmin } = useAdmin();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [filter, setFilter] = useState<BookmarkType | 'all'>('all');
  const [search, setSearch] = useState('');
  const supabase = createClient();

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
    if (!error && data) setBookmarks(data as Bookmark[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleDelete = async (bookmark: Bookmark) => {
    if (!confirm('确定删除这条收藏？')) return;
    await fetch(`/api/bookmarks/${bookmark.id}`, { method: 'DELETE' });
    fetchBookmarks();
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setEditorOpen(true);
  };

  const handleNew = () => {
    setEditingBookmark(null);
    setEditorOpen(true);
  };

  // 前端筛选
  const filtered = bookmarks.filter((b) => {
    if (filter !== 'all' && b.type !== filter) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 类型筛选 */}
          {(['all', 'link', 'note', 'image'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]'
              }`}
            >
              {t === 'all' ? '全部' : t === 'link' ? '链接' : t === 'note' ? '笔记' : '图片'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted-foreground))]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索收藏..."
              className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg text-sm text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>
          {isAdmin && (
            <Button onClick={handleNew} size="sm">
              <Plus size={16} />
              新建
            </Button>
          )}
        </div>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[rgb(var(--muted-foreground))]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[rgb(var(--muted-foreground))]">
          <Folders size={48} className="mb-3 opacity-30" />
          <p className="text-lg mb-2">暂无收藏</p>
          <p className="text-sm">点击右上角 + 添加你的第一条收藏</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 编辑弹窗 */}
      <BookmarkEditor
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingBookmark(null); }}
        onSaved={fetchBookmarks}
        bookmark={editingBookmark}
      />
    </div>
  );
}
