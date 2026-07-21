'use client';

import { useRef } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CometCard } from '@/components/ui/CometCard';
import { RippleGrid } from '@/components/ui/RippleGrid';
import { NoiseButton } from '@/components/ui/NoiseButton';
import { useRouter } from 'next/navigation';
import { Bookmark, Music } from 'lucide-react';
import { motion } from 'motion/react';

const SHAPES = [
  { size: 280, color: 'bg-blue-500/20', blur: 'blur-[80px]', x: [0,40,-30,20,0], y: [0,-40,20,-10,0], dur:18, pos:'top-[10%] left-[5%]' },
  { size: 220, color: 'bg-purple-500/20', blur: 'blur-[70px]', x: [0,-30,50,-20,0], y: [0,50,-30,10,0], dur:22, pos:'bottom-[15%] right-[8%]' },
  { size: 180, color: 'bg-cyan-500/15', blur: 'blur-[60px]', x: [0,50,-20,30,0], y: [0,-30,40,-20,0], dur:15, pos:'top-[40%] right-[20%]' },
  { size: 160, color: 'bg-pink-500/12', blur: 'blur-[60px]', x: [0,-20,40,-30,0], y: [0,30,-50,20,0], dur:25, pos:'bottom-[30%] left-[25%]' },
  { size: 120, color: 'bg-emerald-500/15', blur: 'blur-[50px]', x: [0,30,-40,10,0], y: [0,-20,30,-40,0], dur:12, pos:'top-[60%] left-[40%]' },
];

export function HomePage() {
  const secondRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToSecond = () => {
    secondRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppLayout>
      {/* ====== 第一页：几何图形 + 毛玻璃 ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a14] via-[#0d0d1f] to-[#0a0a10]">
        {/* 几何图形漂移 */}
        {SHAPES.map((s, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${s.color} ${s.blur} pointer-events-none ${s.pos}`}
            style={{ width: s.size, height: s.size }}
            animate={{ x: s.x, y: s.y }}
            transition={{ duration: s.dur, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* 毛玻璃欢迎卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 glass-strong rounded-3xl px-12 py-14 sm:px-16 sm:py-16
                     shadow-2xl shadow-black/30 flex flex-col items-center gap-6 mx-4"
        >
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            欢迎
          </h1>
          <p className="text-base sm:text-lg text-white/25 font-light tracking-[0.3em] uppercase">
            Your Digital Sanctuary
          </p>
          <div className="mt-2">
            <NoiseButton onClick={scrollToSecond} />
          </div>
        </motion.div>

        {/* 底部渐变过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ====== 第二页：Ripple + Comet 卡片 ====== */}
      <section
        ref={secondRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
      >
        <RippleGrid rows={6} cellSize={60} />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 sm:gap-16 px-4">
          <CometCard onClick={() => router.push('/bookmarks')} rotateDepth={15} className="w-72 sm:w-80">
            <div className="p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <Bookmark size={32} className="text-white/50" />
              </div>
              <h2 className="text-xl font-semibold text-white/80">收藏</h2>
              <p className="text-sm text-white/30 text-center">探索精选内容与灵感</p>
              <span className="text-xs text-white/15 mt-2">点击进入 →</span>
            </div>
          </CometCard>
          <CometCard onClick={() => router.push('/music')} rotateDepth={15} className="w-72 sm:w-80">
            <div className="p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <Music size={32} className="text-white/50" />
              </div>
              <h2 className="text-xl font-semibold text-white/80">音乐</h2>
              <p className="text-sm text-white/30 text-center">氛围音乐 · 专注时刻</p>
              <span className="text-xs text-white/15 mt-2">点击进入 →</span>
            </div>
          </CometCard>
        </div>
      </section>
    </AppLayout>
  );
}
