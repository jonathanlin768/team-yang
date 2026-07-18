import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 自定义域名直接指向根路径，base 改为 '/'
  base: '/',
  plugins: [react()],
})
