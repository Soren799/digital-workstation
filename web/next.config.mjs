/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片远程域名
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
