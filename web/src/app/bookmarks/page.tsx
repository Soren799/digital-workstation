'use client';

import { AppLayout } from '@/components/AppLayout';
import { BookmarkList } from '@/modules/bookmarks/components/BookmarkList';

export default function BookmarksPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-2xl font-bold mb-1">📑 收藏</h1>
        <p className="text-[rgb(var(--muted-foreground))] mb-6">管理你的链接、笔记和图片收藏</p>
        <BookmarkList />
      </div>
    </AppLayout>
  );
}
