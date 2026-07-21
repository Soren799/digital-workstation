'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/modules/auth';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/types';
import { Plus, Copy, Check, Loader2, Shield } from 'lucide-react';

interface InviteCode {
  id: string;
  code: string;
  used_by: string | null;
  used_at: string | null;
  created_by: string;
  created_at: string;
  profiles?: { display_name?: string; email?: string } | null;
}

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 非管理员重定向
  useEffect(() => {
    if (!authLoading && profile && profile.role !== 'admin') {
      router.push('/');
    }
  }, [authLoading, profile, router]);

  const fetchCodes = useCallback(async () => {
    const { data } = await supabase
      .from('invite_codes')
      .select('*, profiles:used_by(display_name, email)')
      .order('created_at', { ascending: false });
    if (data) setInviteCodes(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const generateCode = async () => {
    setGenerating(true);
    const code = 'INV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    await supabase.from('invite_codes').insert({ code, created_by: user!.id });
    setGenerating(false);
    fetchCodes();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (authLoading) return null;
  if (!profile || profile.role !== 'admin') return null;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold">后台管理</h1>
        </div>

        {/* 邀请码 */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">邀请码管理</h2>
            <button
              onClick={generateCode}
              disabled={generating}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-full transition-colors"
            >
              <Plus size={14} />
              {generating ? '生成中...' : '生成邀请码'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-white/20" size={24} /></div>
          ) : inviteCodes.length === 0 ? (
            <p className="text-white/20 text-sm py-8 text-center">暂无邀请码，点击上方按钮生成</p>
          ) : (
            <div className="space-y-2">
              {inviteCodes.map((inv) => (
                <div
                  key={inv.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                    inv.used_by ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.04] border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <code className="text-sm font-mono text-white/60">{inv.code}</code>
                    {inv.used_by ? (
                      <span className="text-xs text-white/20">
                        已使用 · {inv.profiles?.display_name || inv.profiles?.email || inv.used_by}
                      </span>
                    ) : (
                      <span className="text-xs text-green-400/60">可用</span>
                    )}
                  </div>
                  {!inv.used_by && (
                    <button
                      onClick={() => copyCode(inv.code)}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {copied === inv.code ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/30" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 用户管理 */}
        <UserManager supabase={supabase} />
      </div>
    </AppLayout>
  );
}

function UserManager({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }: { data: Profile[] | null }) => {
      if (data) setUsers(data);
      setLoading(false);
    });
  }, [supabase]);

  const changeRole = async (userId: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">用户管理</h2>
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-white/20" size={24} /></div>
      ) : (
        <div className="space-y-1">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-sm text-white/70">{u.display_name || '未设置昵称'}</p>
                <p className="text-xs text-white/20">{u.email}</p>
              </div>
              <select
                value={u.role}
                onChange={(e) => changeRole(u.id, e.target.value)}
                className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/60 focus:outline-none focus:border-blue-500/50"
              >
                <option value="visitor">访客</option>
                <option value="friend">Friend</option>
                <option value="admin">管理员</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
