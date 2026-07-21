'use client';

import { useRef } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CometCard } from '@/components/ui/CometCard';
import { RippleGrid } from '@/components/ui/RippleGrid';
import { NoiseButton } from '@/components/ui/NoiseButton';
import { useRouter } from 'next/navigation';
import { Bookmark, Music } from 'lucide-react';

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
        {/* Aurora 背景 */}
        <div className="aurora-bg absolute inset-0" />

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
