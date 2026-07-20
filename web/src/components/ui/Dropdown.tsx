'use client';

import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, type ReactNode } from 'react';

interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
}

export function Dropdown({ trigger, items, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={cn(
          'absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow-xl z-50 py-1 animate-fade-in',
          className
        )}>
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors',
                item.danger
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-[rgb(var(--foreground))] hover:bg-[rgb(var(--muted))]'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
