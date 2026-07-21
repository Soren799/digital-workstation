'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />
      {/* 内容 */}
      <div
        className={cn(
          'relative w-full max-w-lg glass-strong border border-white/10 rounded-2xl shadow-2xl animate-fade-in',
          className
        )}
      >
        {/* 标题栏 */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {/* 内容 */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
