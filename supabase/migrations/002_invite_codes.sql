-- 邀请码表
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  used_by UUID REFERENCES auth.users(id) NULL,
  used_at TIMESTAMPTZ NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- 管理员可查看所有邀请码
CREATE POLICY "管理员可查看所有邀请码" ON public.invite_codes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 管理员可创建邀请码
CREATE POLICY "管理员可创建邀请码" ON public.invite_codes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 检查邀请码是否有效（不绑定用户）
CREATE OR REPLACE FUNCTION check_invite_code(p_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.invite_codes WHERE code = p_code AND used_by IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 绑定邀请码到用户（注册成功后调用）
CREATE OR REPLACE FUNCTION claim_invite_code(p_code TEXT, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.invite_codes SET used_by = p_user_id, used_at = now()
  WHERE code = p_code AND used_by IS NULL;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
