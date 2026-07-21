import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">创建账号</h1>
          <p className="text-gray-400">开启你的数字工作台之旅</p>
        </div>
        <div className="glass-strong border border-white/10 rounded-2xl p-8 shadow-2xl">
          <RegisterForm />
        </div>
        <p className="text-center mt-6 text-sm text-gray-500">
          已有账号？{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  );
}
