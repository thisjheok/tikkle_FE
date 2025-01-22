import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 주요 React 관련 라이브러리
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Redux 관련
          'redux-vendor': ['react-redux', '@reduxjs/toolkit'],
          
          // Sentry
          'monitoring': ['@sentry/react'],
          
          // 소셜 로그인 관련
          'auth-vendor': ['gapi-script'],
        }
      }
    },
    // 청크 사이즈 경고 기준값 조정 (선택사항)
    chunkSizeWarningLimit: 1000,
  }
})
