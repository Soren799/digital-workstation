'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';

interface CometCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  rotateDepth?: number;
}

export function CometCard({ children, className = '', onClick, rotateDepth = 15 }: CometCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [rotateDepth, -rotateDepth]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-rotateDepth, rotateDepth]), springConfig);
  const z = useSpring(useTransform(mouseY, [0, 1], [0, 50]), springConfig);

  const glareX = useTransform(mouseX, [0, 1], [0, 100]);
  const glareY = useTransform(mouseY, [0, 1], [0, 100]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const shadowStyle = {
    boxShadow: `
      0 0 520px rgba(0,0,0,0.4),
      0 0 333px rgba(0,0,0,0.3),
      0 0 83px rgba(0,0,0,0.2),
      0 0 21px rgba(0,0,0,0.15)
    `,
  };

  return (
    <div className={`perspective-distant ${className}`} style={shadowStyle}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ rotateX, rotateY, z }}
        className="preserve-3d relative rounded-2xl overflow-hidden cursor-pointer glass hover:border-white/15 transition-colors"
      >
        {children}
        {/* 彗星光泽 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: glareBg, mixBlendMode: 'overlay' as const }}
        />
      </motion.div>
    </div>
  );
}
