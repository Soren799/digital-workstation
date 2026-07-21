'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface Track {
  title: string;
  file: string;
  color: string;
}

// 从 public/music/ 读取文件列表
const DEFAULT_TRACKS: Track[] = [
  { title: 'Is There Someone Else', file: '/music/Is There Someone Else_ - The Weeknd.mp3', color: '#f59e0b' },
  { title: 'Popular', file: '/music/popular-the-weeknd.mp3', color: '#3b82f6' },
];

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = DEFAULT_TRACKS[currentTrack];

  useEffect(() => {
    const audio = new Audio(track.file);
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');
    audio.preload = 'auto';
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, [track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // 手机端需要用户交互，静默失败
      });
    }
  };

  const prevTrack = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setCurrentTrack((prev) => (prev - 1 + DEFAULT_TRACKS.length) % DEFAULT_TRACKS.length);
  };

  const nextTrack = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setCurrentTrack((prev) => (prev + 1) % DEFAULT_TRACKS.length);
  };

  // 缓存装饰方块随机值
  const decorations = useMemo(() =>
    Array.from({ length: 12 }, () => ({
      w: 40 + Math.random() * 80,
      h: 40 + Math.random() * 80,
      l: Math.random() * 90,
      t: Math.random() * 90,
      r: Math.random() * 45 - 22,
    })), []
  );

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <AppLayout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a12] via-[#0d0d1a] to-[#0a0a0f]">
        {/* 装饰方块 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
          {decorations.map((d, i) => (
            <div
              key={i}
              className="absolute rounded-lg border border-white/5"
              style={{
                width: d.w, height: d.h, left: `${d.l}%`, top: `${d.t}%`,
                transform: `rotate(${d.r}deg)`,
                background: 'rgba(255,255,255,0.02)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 flex flex-col items-center">
          {/* CD 唱片 */}
          <div className="relative mb-10">
            <div
              className={`w-56 h-56 rounded-full border-[3px] border-white/10 flex items-center justify-center
                bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl
                ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
              style={{ boxShadow: `0 0 100px ${track.color}15, 0 0 30px ${track.color}08` }}
            >
              <div className="w-16 h-16 rounded-full bg-[#0a0a12] border-2 border-white/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/30 to-white/5" />
              </div>
              <div className="absolute inset-6 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-10 rounded-full border border-white/[0.02]" />
            </div>
          </div>

          {/* 歌曲名 */}
          <h1 className="text-xl font-bold text-white/80 mb-1 text-center">{track.title}</h1>

          {/* 进度条 */}
          <div className="w-64 h-1 bg-white/5 rounded-full mt-6 mb-6 overflow-hidden">
            <div className="h-full bg-white/20 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-6 mb-8">
            <button onClick={prevTrack} className="p-2 text-white/30 hover:text-white/60 transition-colors">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/10
                flex items-center justify-center transition-all hover:scale-105"
            >
              {isPlaying ? <Pause size={20} className="text-white/80" /> : <Play size={20} className="text-white/80 ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="p-2 text-white/30 hover:text-white/60 transition-colors">
              <SkipForward size={20} />
            </button>
          </div>

          {/* 歌曲列表 */}
          <div className="w-full space-y-1 mt-8" onMouseLeave={() => setHoveredIdx(null)}>
            <p className="text-xs text-white/15 mb-3 text-center tracking-widest uppercase">Playlist</p>
            {DEFAULT_TRACKS.map((t, i) => {
              const dist = hoveredIdx !== null ? Math.abs(i - hoveredIdx) : 99;
              const highlight = dist === 0 ? 1 : dist === 1 ? 0.6 : dist === 2 ? 0.3 : 0;
              return (
              <button
                key={t.file}
                onClick={() => { setCurrentTime(0); setIsPlaying(false); setCurrentTrack(i); }}
                onMouseEnter={() => setHoveredIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-left transition-all duration-200 text-sm
                  ${i === currentTrack
                    ? 'bg-white/10 border border-white/10'
                    : 'border border-transparent'
                  }`}
                style={{
                  backgroundColor: highlight > 0 ? `rgba(255,255,255,${highlight * 0.06})` : undefined,
                  borderColor: highlight > 0.6 ? `rgba(255,255,255,${highlight * 0.12})` : 'transparent',
                  transform: highlight > 0.6 ? `scale(${1 + highlight * 0.02})` : undefined,
                }}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                <span className={i === currentTrack ? 'text-white/70' : 'text-white/30'}>
                  {t.title}
                </span>
                {i === currentTrack && isPlaying && (
                  <span className="ml-auto text-[10px] text-white/20 animate-pulse">ON AIR</span>
                )}
              </button>
              );
            })}
          </div>

          {/* 提示 */}
          <p className="text-xs text-white/10 mt-10 text-center">
            管理员可在 public/music/ 目录添加新音乐
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
