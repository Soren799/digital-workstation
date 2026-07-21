'use client';

import { TopBar } from './TopBar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950">
      {/* 背景光斑 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[-15%] w-[50%] h-[50%] rounded-full bg-blue-500/12 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-cyan-500/6 blur-[100px]" />
      </div>
      <TopBar />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
