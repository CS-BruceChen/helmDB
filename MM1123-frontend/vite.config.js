import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
// import ViteMonacoPlugin from 'vite-plugin-monaco-editor'

// https://vite.dev/config/
export default defineConfig({
  base: '/helmdb/',
  plugins: [
    vue(),
    // vueDevTools(),
    // ViteMonacoPlugin({})
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
