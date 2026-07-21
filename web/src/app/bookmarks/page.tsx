'use client';

import { AppLayout } from '@/components/AppLayout';
import { BookmarkList } from '@/modules/bookmarks/components/BookmarkList';

export default function BookmarksPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">📑 收藏</h1>
          <p className="text-white/30 text-sm">精选内容与灵感</p>
        </div>
        <BookmarkList />
      </div>
    </AppLayout>
  );
}
