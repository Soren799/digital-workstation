'use client';

import { useAuth } from '@/modules/auth';
import { LogOut, User, Bookmark } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function TopBar() {
  const { user, profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="h-14 glass border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      {/* 左侧 — Logo */}
      <Link href="/" className="text-lg font-bold tracking-tight shrink-0">
        <span className="text-blue-400">数字</span>
        <span className="text-white/80">工作台</span>
      </Link>

      {/* 右侧 */}
      <div className="flex items-center gap-2">
        {/* 收藏入口 — 仅登录用户可见 */}
        {user && (
          <button
            onClick={() => router.push('/bookmarks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                       bg-white/5 hover:bg-white/10 border border-white/5
                       text-white/60 hover:text-white/90 transition-all"
          >
            <Bookmark size={14} />
            收藏
          </button>
        )}

        {/* 用户菜单 */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {(profile?.display_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm text-white/70">
                {profile?.display_name || user.email?.split('@')[0]}
              </span>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 glass-strong border border-white/10 rounded-xl shadow-xl z-20 py-1 animate-fade-in">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{profile?.display_name || '用户'}</p>
                    <p className="text-xs text-white/40 mt-0.5">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-300 font-medium">
                      {roleLabel(profile?.role)}
                    </span>
                  </div>
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => { setShowMenu(false); router.push('/admin'); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 transition-colors"
                    >
                      <User size={15} />
                      后台管理
                    </button>
                  )}
                  <button
                    onClick={() => { setShowMenu(false); signOut(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm text-white/60 hover:text-white border border-white/10 rounded-full hover:bg-white/5 transition-all"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors"
            >
              注册
            </Link>
          </div>
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
