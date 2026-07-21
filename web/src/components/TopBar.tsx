'use client';

import { useAdmin } from '@/hooks/useAdmin';
import { Lock, Unlock, Home, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

export function TopBar() {
  const { isAdmin, unlock, lock } = useAdmin();
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(true);
  const { scrollY } = useScroll();
  const router = useRouter();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest < prev || latest < 50) setVisible(true);
    else if (latest > 100 && latest > prev) setVisible(false);
  });

  const handleUnlock = async () => {
    const ok = await unlock(pwd);
    if (ok) { setShowPwd(false); setPwd(''); setError(false); }
    else setError(true);
  };

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-4 inset-x-0 mx-auto max-w-max z-50"
    >
      <nav className="flex items-center justify-center gap-3 px-4 py-2 rounded-full glass-strong border border-white/10 shadow-2xl shadow-black/40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors">
          <Sparkles size={16} className="text-blue-400" />
          <span className="text-sm font-semibold text-white/70 hidden sm:inline">WS</span>
        </Link>

        {/* 主页 */}
        <button
          onClick={() => { router.push('/'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <Home size={14} />
          <span className="hidden sm:inline">主页</span>
        </button>

        {/* 分隔 */}
        <div className="w-px h-5 bg-white/10" />

        {/* 密码锁 */}
        {isAdmin ? (
          <button onClick={lock} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-green-400/80 hover:text-green-400 hover:bg-white/5 transition-all">
            <Unlock size={14} />
            <span className="hidden sm:inline">管理员</span>
          </button>
        ) : showPwd ? (
          <div className="flex items-center gap-1">
            <input
              type="password"
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="密码"
              autoFocus
              className="w-20 px-2 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50"
            />
            <button onClick={handleUnlock} className="text-xs text-white/50 hover:text-white px-1">确定</button>
            <button onClick={() => { setShowPwd(false); setPwd(''); setError(false); }} className="text-xs text-white/30 hover:text-white px-1">取消</button>
          </div>
        ) : (
          <button onClick={() => setShowPwd(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Lock size={14} />
          </button>
        )}
      </nav>
      {error && <p className="text-xs text-red-400/80 text-center mt-1">密码错误</p>}
    </motion.header>
  );
}
