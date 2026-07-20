'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Tile } from '@/types';
import * as Icons from 'lucide-react';

const ICON_OPTIONS = [
  'Folder', 'Star', 'Heart', 'Zap', 'Globe', 'Bookmark', 'Code',
  'Camera', 'Music', 'Video', 'FileText', 'Calendar', 'Map', 'Send',
  'ShoppingCart', 'Coffee', 'Gift', 'Trophy', 'Crown', 'Rocket',
];

const COLOR_OPTIONS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6',
];

interface TileEditorProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  tile?: Tile | null;
}

export function TileEditor({ open, onClose, onSaved, tile }: TileEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [color, setColor] = useState('#3B82F6');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [link, setLink] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (tile) {
      setTitle(tile.title);
      setDescription(tile.description || '');
      setIcon(tile.icon);
      setColor(tile.color);
      setSize(tile.size);
      setLink(tile.link || '');
      setIsPublic(tile.is_public);
    } else {
      reset();
    }
  }, [tile, open]);

  const reset = () => {
    setTitle('');
    setDescription('');
    setIcon('Folder');
    setColor('#3B82F6');
    setSize('medium');
    setLink('');
    setIsPublic(false);
    setError('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('请输入磁贴标题');
      return;
    }
    setSaving(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('请先登录');
      setSaving(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      icon,
      color,
      size,
      link: link.trim() || null,
      is_public: isPublic,
    };

    if (tile) {
      const { error: updateError } = await supabase
        .from('tiles')
        .update(payload)
        .eq('id', tile.id);
      if (updateError) { setError(updateError.message); setSaving(false); return; }
    } else {
      const { error: insertError } = await supabase
        .from('tiles')
        .insert({ ...payload, user_id: user.id });
      if (insertError) { setError(insertError.message); setSaving(false); return; }
    }

    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={tile ? '编辑磁贴' : '新建磁贴'}>
      <div className="space-y-4">
        <Input
          id="title"
          label="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="磁贴标题"
          error={error}
        />
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1.5">
            描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述"
            rows={3}
            className="w-full px-4 py-2.5 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-colors"
          />
        </div>
        <Input
          id="link"
          label="链接（可选）"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
        />
        {/* 图标选择 */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">
            图标
          </label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((name) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const IconComp = (Icons as any)[name];
              return (
                <button
                  key={name}
                  onClick={() => setIcon(name)}
                  className={`p-2 rounded-lg transition-colors ${
                    icon === name ? 'bg-blue-600 text-white' : 'hover:bg-[rgb(var(--muted))]'
                  }`}
                  title={name}
                >
                  {IconComp && <IconComp size={18} />}
                </button>
              );
            })}
          </div>
        </div>
        {/* 颜色选择 */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">
            颜色
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ring-offset-2 ring-offset-[rgb(var(--card))] ${
                  color === c ? 'scale-110' : ''
                }`}
                style={{ backgroundColor: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
              />
            ))}
          </div>
        </div>
        {/* 尺寸 & 可见性 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-2">
              尺寸
            </label>
            <div className="flex gap-1 bg-[rgb(var(--muted))] rounded-lg p-1">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    size === s
                      ? 'bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-sm'
                      : 'text-[rgb(var(--muted-foreground))]'
                  }`}
                >
                  {s === 'small' ? '小' : s === 'medium' ? '中' : '大'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded border-[rgb(var(--border))] bg-[rgb(var(--card))] accent-blue-600"
              />
              <span className="text-sm text-[rgb(var(--muted-foreground))]">公开</span>
            </label>
          </div>
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
