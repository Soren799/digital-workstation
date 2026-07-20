'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { TileGrid } from '@/modules/tiles/components/TileGrid';
import { TileEditor } from '@/modules/tiles/components/TileEditor';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/modules/auth';
import { createClient } from '@/lib/supabase/client';
import { Plus, Loader2 } from 'lucide-react';
import type { Tile } from '@/types';

export function HomePage() {
  const { user, profile } = useAuth();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const supabase = createClient();

  const fetchTiles = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('tiles').select('*').order('sort_order', { ascending: true });

    // 未登录只显示公开磁贴
    if (!user) {
      query = query.eq('is_public', true);
    } else {
      query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
    }

    const { data, error } = await query;
    if (!error && data) setTiles(data as Tile[]);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    fetchTiles();
  }, [fetchTiles]);

  const handleEdit = (tile: Tile) => {
    setEditingTile(tile);
    setEditorOpen(true);
  };

  const handleNew = () => {
    setEditingTile(null);
    setEditorOpen(true);
  };

  const handleReorder = async (reordered: Tile[]) => {
    setTiles(reordered);
    const updates = reordered.map((t, i) => ({
      id: t.id,
      sort_order: i,
    }));
    await Promise.all(
      updates.map((u) =>
        supabase.from('tiles').update({ sort_order: u.sort_order }).eq('id', u.id)
      )
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 页眉 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {profile ? `你好，${profile.display_name || '用户'} 👋` : '欢迎来到数字工作台'}
            </h1>
            <p className="text-[rgb(var(--muted-foreground))] mt-1">
              {user && profile?.role !== 'visitor' ? '管理你的磁贴，快速访问常用内容' : user ? '浏览公开磁贴' : '登录后即可创建个性化磁贴'}
            </p>
          </div>
          {user && profile?.role !== 'visitor' && (
            <Button onClick={handleNew} size="sm">
              <Plus size={16} />
              新建磁贴
            </Button>
          )}
        </div>

        {/* 磁贴区域 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[rgb(var(--muted-foreground))]" />
          </div>
        ) : (
          <TileGrid
            tiles={tiles}
            onReorder={handleReorder}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* 编辑弹窗 */}
      <TileEditor
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingTile(null); }}
        onSaved={fetchTiles}
        tile={editingTile}
      />
    </AppLayout>
  );
}
