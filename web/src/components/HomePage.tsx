'use client';

import { useRef } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CometCard } from '@/components/ui/CometCard';
import { RippleGrid } from '@/components/ui/RippleGrid';
import { NoiseButton } from '@/components/ui/NoiseButton';
import { useRouter } from 'next/navigation';
import { Bookmark, Music } from 'lucide-react';
import { motion } from 'motion/react';

export function HomePage() {
  const secondRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToSecond = () => {
    secondRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppLayout>
      {/* ====== 第一页：Aurora 极光 + 欢迎 ====== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Aurora 背景 — Aceternity 官方实现 */}
        <div
          className="absolute inset-0 animate-aurora"
          style={{
            backgroundImage: `repeating-linear-gradient(100deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.15) 5%, transparent 10%, rgba(16,185,129,0.12) 15%, rgba(59,130,246,0.2) 20%),
            repeating-linear-gradient(200deg, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.12) 10%, transparent 15%, rgba(236,72,153,0.1) 20%, rgba(139,92,246,0.18) 25%)`,
            backgroundSize: '200% 200%, 200% 200%',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 70%)',
          }}
        />

        {/* 流动光斑 */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-500/25 blur-[120px] pointer-events-none"
          animate={{ x: [0, 60, -40, 20, 0], y: [0, -50, 30, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-purple-500/20 blur-[120px] pointer-events-none right-0 bottom-1/4"
          animate={{ x: [0, -50, 30, -20, 0], y: [0, 40, -30, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none top-1/3 right-1/4"
          animate={{ x: [0, -30, 50, -20, 0], y: [0, 30, -40, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />

        {/* 内容 */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-4">
          <div className="text-center space-y-4">
            <h1 className="text-7xl sm:text-8xl font-bold tracking-tight text-white drop-shadow-lg">
              欢迎
            </h1>
            <p className="text-lg sm:text-xl text-white/30 font-light tracking-widest uppercase">
              Your Digital Sanctuary
            </p>
          </div>
        </div>

        {/* 底部进入按钮 */}
        <div className="absolute bottom-16 z-10">
          <NoiseButton onClick={scrollToSecond} />
        </div>

        {/* 底部渐变过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ====== 第二页：Ripple 背景 + Comet 卡片 ====== */}
      <section
        ref={secondRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
      >
        {/* Ripple 网格背景 */}
        <RippleGrid rows={8} cols={27} cellSize={56} />

        {/* 卡片区域 */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 sm:gap-16 px-4">
          {/* 收藏卡片 */}
          <CometCard
            onClick={() => router.push('/bookmarks')}
            rotateDepth={15}
            className="w-72 sm:w-80"
          >
            <div className="p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <Bookmark size={32} className="text-white/50" />
              </div>
              <h2 className="text-xl font-semibold text-white/80">收藏</h2>
              <p className="text-sm text-white/30 text-center">
                探索精选内容与灵感
              </p>
              <span className="text-xs text-white/15 mt-2">点击进入 →</span>
            </div>
          </CometCard>

          {/* 音乐卡片 */}
          <CometCard
            onClick={() => router.push('/music')}
            rotateDepth={15}
            className="w-72 sm:w-80"
          >
            <div className="p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <Music size={32} className="text-white/50" />
              </div>
              <h2 className="text-xl font-semibold text-white/80">音乐</h2>
              <p className="text-sm text-white/30 text-center">
                氛围音乐 · 专注时刻
              </p>
              <span className="text-xs text-white/15 mt-2">点击进入 →</span>
            </div>
          </CometCard>
        </div>
      </section>
    </AppLayout>
  );
}
