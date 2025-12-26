/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [ // 
      // https だけ許可 。特定ドメインのみ許可
      { protocol: 'https', hostname: 'placehold.jp' },
      { protocol: 'https', hostname: 'images.microcms-assets.io' }
    ],
  },
};

export default nextConfig;
