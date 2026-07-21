'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAdmin } from '@/hooks/useAdmin';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Plus, Copy, Check, Loader2, Shield } from 'lucide-react';

interface InviteCode {
  id: string; code: string; used_by: string | null; used_at: string | null; created_at: string;
}

export default function AdminPage() {
  const { isAdmin } = useAdmin();
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => { if (!isAdmin) router.push('/'); }, [isAdmin, router]);

  const fetchCodes = useCallback(async () => {
    const { data } = await supabase.from('invite_codes').select('*').order('created_at', { ascending: false });
    if (data) setInviteCodes(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const generateCode = async () => {
    setGenerating(true);
    const code = 'INV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    // Use zero UUID for created_by since we removed auth
    await supabase.from('invite_codes').insert({ code, created_by: '00000000-0000-0000-0000-000000000000' });
    setGenerating(false);
    fetchCodes();
  };

  if (!isAdmin) return null;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold">后台管理</h1>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">邀请码管理</h2>
            <button onClick={generateCode} disabled={generating}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-full transition-colors">
              <Plus size={14} />{generating ? '生成中...' : '生成邀请码'}
            </button>
          </div>
          {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-white/20" size={24} /></div>
          : inviteCodes.length === 0 ? <p className="text-white/20 text-sm py-8 text-center">暂无邀请码</p>
          : <div className="space-y-2">
              {inviteCodes.map((inv) => (
                <div key={inv.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${inv.used_by ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.04] border-white/10'}`}>
                  <div className="flex items-center gap-3">
                    <code className="text-sm font-mono text-white/60">{inv.code}</code>
                    {inv.used_by ? <span className="text-xs text-white/20">已使用</span> : <span className="text-xs text-green-400/60">可用</span>}
                  </div>
                  {!inv.used_by && (
                    <button onClick={() => { navigator.clipboard.writeText(inv.code); setCopied(inv.code); setTimeout(() => setCopied(null), 2000); }}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                      {copied === inv.code ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/30" />}
                    </button>
                  )}
                </div>
              ))}
            </div>}
        </div>
      </div>
    </AppLayout>
  );
}
