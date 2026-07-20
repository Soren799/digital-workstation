'use client';

import { useAuth } from '@/modules/auth';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-16 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* 左侧 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-blue-500">数字</span>
          <span className="text-[rgb(var(--foreground))]">工作台</span>
        </Link>
      </div>

      {/* 右侧 */}
      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors"
          aria-label="切换主题"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* 用户菜单 */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {(profile?.display_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm text-[rgb(var(--foreground))]">
                {profile?.display_name || user.email}
              </span>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow-xl z-20 py-1 animate-fade-in">
                  <div className="px-4 py-2 border-b border-[rgb(var(--border))]">
                    <p className="text-sm font-medium">{profile?.display_name || '用户'}</p>
                    <p className="text-xs text-[rgb(var(--muted-foreground))]">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400">
                      {roleLabel(profile?.role)}
                    </span>
                  </div>
                  <button
                    onClick={() => { setShowMenu(false); signOut(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <User size={16} />
            登录
          </Link>
        )}
      </div>
    </header>
  );
}

function roleLabel(role?: string) {
  switch (role) {
    case 'admin': return '管理员';
    case 'friend': return 'Friend';
    default: return '访客';
  }
}
