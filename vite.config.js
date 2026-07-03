import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const polarTarget = env.VITE_POLAR_SERVER === 'production'
    ? 'https://api.polar.sh'
    : 'https://sandbox-api.polar.sh'

  return {
    base: process.env.GITHUB_PAGES ? '/onepage/' : '/',
    plugins: [react()],
    server: {
      watch: {
        ignored: ['**/products.json', '**/src/assets/images/**'],
      },
      // Polar API 프록시 — 액세스 토큰을 서버 측에서 주입해 브라우저 번들에 노출되지 않게 함
      proxy: {
        '/polar-api': {
          target: polarTarget,
          changeOrigin: true,
          rewrite: p => p.replace(/^\/polar-api/, ''),
          headers: { Authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}` },
        },
      },
    },
  }
})
