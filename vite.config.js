import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/tactical-training/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    hmr: {
      port: 5173,
    },
    watch: {
      usePolling: true
    },
    origin: 'https://5173-i7awqdimkjsnu5j6g802w-7b65c885.manusvm.computer'
  }
})