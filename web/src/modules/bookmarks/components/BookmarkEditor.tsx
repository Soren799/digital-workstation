'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Bookmark, BookmarkType } from '@/types';
import { X } from 'lucide-react';

interface BookmarkEditorProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  bookmark?: Bookmark | null;
}

const PRESET_TAGS = ['工具', '设计', '开发', '阅读', '视频', '灵感', '参考', '效率'];

export function BookmarkEditor({ open, onClose, onSaved, bookmark }: BookmarkEditorProps) {
  const [type, setType] = useState<BookmarkType>('link');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (bookmark) {
      setType(bookmark.type);
      setTitle(bookmark.title);
      setDescription(bookmark.description || '');
      setUrl(bookmark.url || '');
      setContent(bookmark.content || '');
      setImageUrl(bookmark.image_url || '');
      setTags(bookmark.tags || []);
      setCategory(bookmark.category || '');
    } else {
      reset();
    }
  }, [bookmark, open]);

  const reset = () => {
    setType('link');
    setTitle('');
    setDescription('');
    setUrl('');
    setContent('');
    setImageUrl('');
    setTags([]);
    setTagInput('');
    setCategory('');
    setError('');
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim()) { setError('请输入标题'); return; }
    setSaving(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('请先登录'); setSaving(false); return; }

    const payload = {
      type,
      title: title.trim(),
      description: description.trim(),
      url: type === 'link' ? url.trim() : null,
      content: type === 'note' ? content.trim() : null,
      image_url: type === 'image' ? imageUrl.trim() : null,
      tags,
      category: category.trim() || null,
    };

    let result;
    if (bookmark) {
      result = await supabase.from('bookmarks').update(payload).eq('id', bookmark.id);
    } else {
      result = await supabase.from('bookmarks').insert({ ...payload, user_id: user.id });
    }

    if (result.error) setError(result.error.message);
    setSaving(false);

    if (!result.error) {
      onSaved();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={bookmark ? '编辑收藏' : '新建收藏'}>
      <div className="space-y-4">
        {/* 类型选择 */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">类型</label>
          <div className="flex gap-1 bg-[rgb(var(--muted))] rounded-lg p-1">
            {(['link', 'note', 'image'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  type === t
                    ? 'bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-sm'
                    : 'text-[rgb(var(--muted-foreground))]'
                }`}
              >
                {t === 'link' ? '链接' : t === 'note' ? '笔记' : '图片'}
              </button>
            ))}
          </div>
        </div>

        <Input id="title" label="标题" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="收藏标题" error={error} />

        {/* 根据类型切换字段 */}
        {type === 'link' && (
          <Input id="url" label="URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        )}
        {type === 'note' && (
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1.5">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="笔记内容..."
              rows={5}
              className="w-full px-4 py-2.5 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-colors"
            />
          </div>
        )}
        {type === 'image' && (
          <Input id="imageUrl" label="图片 URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://...image.png" />
        )}

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1.5">描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述（可选）"
            rows={2}
            className="w-full px-4 py-2.5 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-colors"
          />
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">标签</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">
                {tag}
                <button onClick={() => removeTag(tag)}><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
              placeholder="输入标签按回车"
              className="flex-1 px-3 py-1.5 text-sm bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESET_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                className="px-2 py-0.5 text-xs rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted-foreground))] hover:border-blue-500/30 hover:text-blue-400 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 分类 */}
        <div>
          <Input id="category" label="分类（可选）" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="如：前端、设计" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
