import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 项目站点部署在 https://<user>.github.io/team-yang/ 下
  base: '/team-yang/',
  plugins: [react()],
})
