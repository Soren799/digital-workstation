-- =============================================
-- 数字工作台 v1.0 — 初始数据库迁移
-- 在 Supabase SQL Editor 中运行此脚本
-- =============================================

-- 1. 用户 Profile 表（用户注册时通过触发器自动创建）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('admin', 'friend', 'visitor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 磁贴表
CREATE TABLE IF NOT EXISTS public.tiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Folder',
  color TEXT NOT NULL DEFAULT '#3B82F6',
  size TEXT NOT NULL DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  link TEXT,
  module TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 收藏表
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'link' CHECK (type IN ('link', 'note', 'image')),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT,
  content TEXT,
  image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 自动更新时间戳触发器
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tiles_updated_at
  BEFORE UPDATE ON public.tiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookmarks_updated_at
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 新用户注册时自动创建 profile
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', ''),
    'visitor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- RLS 策略
-- =============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可查看自己的 profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "管理员可查看所有 profile"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "用户可更新自己的 profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tiles
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可查看公开磁贴"
  ON public.tiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "用户可查看自己的磁贴"
  ON public.tiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可创建磁贴"
  ON public.tiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可更新自己的磁贴"
  ON public.tiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可删除自己的磁贴"
  ON public.tiles FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可查看公开收藏"
  ON public.bookmarks FOR SELECT
  USING (is_public = true);

CREATE POLICY "用户可查看自己的收藏"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可创建收藏"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可更新自己的收藏"
  ON public.bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可删除自己的收藏"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);
