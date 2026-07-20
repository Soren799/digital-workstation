/** @type {import('next').NextConfig} */
const nextConfig = {
  // EdgeOne Pages 兼容配置
  output: 'standalone',
  // 图片远程域名（如后续需要）
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
