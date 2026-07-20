'use client';

import { useAuth } from '@/modules/auth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid,
  Bookmark,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile } = useAuth();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/', label: '工作台', icon: LayoutGrid },
    { href: '/bookmarks', label: '收藏', icon: Bookmark },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ href: '/admin', label: '管理', icon: Settings });
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 移动端遮罩 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[rgb(var(--card))] border-r border-[rgb(var(--border))]
          z-40 transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* 移动端关闭按钮 */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[rgb(var(--border))] lg:hidden">
          <span className="text-lg font-bold">
            <span className="text-blue-500">数字</span>工作台
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 导航 */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? 'bg-blue-600/10 text-blue-500'
                    : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                  }
                `}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 底部角色标识 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgb(var(--border))]">
          <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted-foreground))]">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {roleLabel(profile?.role)}
          </div>
        </div>
      </aside>
    </>
  );
}

function roleLabel(role?: string) {
  switch (role) {
    case 'admin': return '管理员';
    case 'friend': return 'Friend';
    default: return '访客';
  }
}
