import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function isAdmin(request: Request): boolean {
  const pw = request.headers.get('x-admin-password');
  return pw === (process.env.ADMIN_PASSWORD || '');
}

// DELETE /api/bookmarks/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = await createClient();
  const { id } = await params;
  const { error } = await supabase.from('bookmarks').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PATCH /api/bookmarks/[id]
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = await createClient();
  const { id } = await params;
  const body = await request.json();
  const { error } = await supabase.from('bookmarks').update(body).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
