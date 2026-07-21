'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

// 使用 Web Audio API 生成环境音景
interface Track {
  title: string;
  freq: number;
  type: OscillatorType;
  color: string;
}

const TRACKS: Track[] = [
  { title: '晨光 · Dawn', freq: 261.63, type: 'sine', color: '#f59e0b' },
  { title: '深海 · Deep Blue', freq: 196.00, type: 'sine', color: '#3b82f6' },
  { title: '森林 · Forest', freq: 329.63, type: 'triangle', color: '#10b981' },
  { title: '星空 · Starlight', freq: 392.00, type: 'sine', color: '#8b5cf6' },
  { title: '雨声 · Raindrop', freq: 440.00, type: 'sine', color: '#06b6d4' },
  { title: '晚风 · Night Breeze', freq: 293.66, type: 'triangle', color: '#ec4899' },
];

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const reverbBufferRef = useRef<AudioBuffer | null>(null);

  const stopOsc = useCallback(() => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    if (reverbRef.current) {
      reverbRef.current.disconnect();
      reverbRef.current = null;
    }
  }, []);

  // 音量同步（仅播放时生效，避免操作已断开节点）
  useEffect(() => {
    const gain = gainRef.current;
    const ctx = audioCtxRef.current;
    if (gain && ctx && oscRef.current && gain.gain.value > 0.01) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
    }
  }, [volume]);

  const playTrack = useCallback((index: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    stopOsc();

    const track = TRACKS[index];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const reverb = ctx.createConvolver();

    // 混响 buffer（仅首次创建，后续复用）
    if (!reverbBufferRef.current) {
      const reverbLength = ctx.sampleRate * 1.5;
      const buf = ctx.createBuffer(1, reverbLength, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < reverbLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
      }
      reverbBufferRef.current = buf;
    }
    reverb.buffer = reverbBufferRef.current;

    osc.type = track.type;
    osc.frequency.setValueAtTime(track.freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(reverb);
    reverb.connect(ctx.destination);
    gain.connect(ctx.destination);

    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
    reverbRef.current = reverb;

    setIsPlaying(true);
    setCurrentTrack(index);
  }, [volume, stopOsc]);

  const togglePlay = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (isPlaying) {
      stopOsc();
      setIsPlaying(false);
    } else {
      playTrack(currentTrack);
    }
  }, [isPlaying, currentTrack, playTrack, stopOsc]);

  const prevTrack = () => {
    const idx = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
    playTrack(idx);
  };
  const nextTrack = () => {
    const idx = (currentTrack + 1) % TRACKS.length;
    playTrack(idx);
  };

  useEffect(() => {
    return () => {
      stopOsc();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stopOsc]);

  const track = TRACKS[currentTrack];

  return (
    <AppLayout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a12] via-[#0d0d1a] to-[#0a0a0f]">
        {/* 拼贴风格装饰 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-lg border border-white/5"
              style={{
                width: `${40 + Math.random() * 80}px`,
                height: `${40 + Math.random() * 80}px`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                transform: `rotate(${Math.random() * 45 - 22}deg)`,
                background: `rgba(255,255,255,${Math.random() * 0.03})`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 flex flex-col items-center">
          {/* CD 唱片 */}
          <div className="relative mb-12">
            <div
              className={`w-64 h-64 rounded-full border-4 border-white/10 flex items-center justify-center
                bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl
                ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
              style={{ boxShadow: `0 0 120px ${track.color}20, 0 0 40px ${track.color}10` }}
            >
              <div className="w-20 h-20 rounded-full bg-[#0a0a12] border-2 border-white/10 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-white/5" />
              </div>
              {/* CD 纹理环 */}
              <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-8 rounded-full border border-white/[0.02]" />
            </div>
          </div>

          {/* 歌曲信息 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white/80 mb-1">{track.title.split('·')[1]?.trim() || track.title}</h1>
            <p className="text-sm text-white/20">{track.title.split('·')[0]?.trim()}</p>
          </div>

          {/* 播放控制 */}
          <div className="flex items-center gap-8 mb-12">
            <button onClick={prevTrack} className="p-2 text-white/30 hover:text-white/60 transition-colors">
              <SkipBack size={22} />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/15 border border-white/10
                flex items-center justify-center transition-all hover:scale-105"
            >
              {isPlaying ? <Pause size={24} className="text-white/80" /> : <Play size={24} className="text-white/80 ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="p-2 text-white/30 hover:text-white/60 transition-colors">
              <SkipForward size={22} />
            </button>
          </div>

          {/* 音量 */}
          <div className="flex items-center gap-3 mb-16">
            <span className="text-xs text-white/20">vol</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 h-1 appearance-none bg-white/10 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/40"
            />
          </div>

          {/* 歌曲列表 */}
          <div className="w-full space-y-1">
            <p className="text-xs text-white/15 mb-3 text-center tracking-widest uppercase">Tracks</p>
            {TRACKS.map((t, i) => (
              <button
                key={t.title}
                onClick={() => playTrack(i)}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-full text-left transition-all
                  ${i === currentTrack
                    ? 'bg-white/10 border border-white/10'
                    : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <span className={`text-sm ${i === currentTrack ? 'text-white/70' : 'text-white/30'}`}>
                  {t.title}
                </span>
                {i === currentTrack && isPlaying && (
                  <span className="ml-auto text-[10px] text-white/20 animate-pulse">PLAYING</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
