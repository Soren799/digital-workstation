import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function isAdmin(request: Request): boolean {
  const pw = request.headers.get('x-admin-password');
  return pw === (process.env.ADMIN_PASSWORD || '');
}

// GET /api/bookmarks — 获取所有收藏（公开）
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('bookmarks').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/bookmarks — 创建收藏（需管理员密码）
export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = await createClient();
  const body = await request.json();
  const { error } = await supabase.from('bookmarks').insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
