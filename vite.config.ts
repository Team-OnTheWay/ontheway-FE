import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 로컬 개발용 임시 프록시: 백엔드 CORS가 localhost를 허용하기 전까지 사용.
    // .env.development.local 에서 API 주소를 /api-proxy 로 바꿨을 때만 쓰인다 (배포 빌드와 무관)
    proxy: {
      '/api-proxy': {
        target: 'https://swyp-ontheway.duckdns.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        // 브라우저의 Origin(localhost)을 빼서 서버가 CORS 검사를 하지 않게 한다
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
      },
    },
  },
})
