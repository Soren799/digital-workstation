import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/bookmarks — 获取收藏列表
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');

  let query = supabase.from('bookmarks').select('*').order('created_at', { ascending: false });

  // 权限过滤
  if (!user) {
    query = query.eq('is_public', true);
  } else {
    query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
  }

  if (type) query = query.eq('type', type);
  if (category) query = query.eq('category', category);
  if (tag) query = query.contains('tags', [tag]);
  if (search) query = query.ilike('title', `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/bookmarks — 创建收藏
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const body = await request.json();
  const { error } = await supabase.from('bookmarks').insert({
    ...body,
    user_id: user.id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
