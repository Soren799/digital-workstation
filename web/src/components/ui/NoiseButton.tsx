'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';

interface NoiseButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function NoiseButton({ onClick, children = '进入', className = '' }: NoiseButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex items-center justify-center px-8 py-3 rounded-full
        bg-gradient-to-r from-white/10 via-white/15 to-white/10
        border border-white/10 cursor-pointer select-none
        hover:border-white/20 transition-colors
        shadow-[0px_2px_0px_0px_rgba(255,255,255,0.05)_inset,0px_-1px_0px_0px_rgba(0,0,0,0.2)_inset,0px_4px_20px_rgba(0,0,0,0.3)]
        ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10 text-white/80 text-sm font-medium tracking-wide">
        {children}
      </span>
      {/* 噪声纹理叠加 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay' as const,
        }}
      />
      {/* 顶部光条 */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[1px]" />
    </motion.div>
  );
}
