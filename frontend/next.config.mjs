/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15+ artık eslint anahtarını desteklemiyor — kaldırıldı.
  // ESLint kontrolü ayrı bir adımda (CI veya `npm run lint`) yapılabilir.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;