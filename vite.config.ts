import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        // 可用 VITE_PROXY_TARGET 指向其他后端, 默认线上环境
        target: process.env.VITE_PROXY_TARGET ?? 'https://api.terraria.ink/apm',
        changeOrigin: true,
      },
    },
  },
})
