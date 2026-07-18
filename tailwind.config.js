/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 玄铁黑系
        xuantie: {
          950: '#0B0B0B',
          900: '#111111',
          800: '#1A1A1A',
          700: '#242424',
          600: '#2E2E2E',
        },
        // 皇家暗金系
        gold: {
          300: '#E8CF8A',
          400: '#DDC176',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#9C7C3C',
          800: '#6E5626',
        },
        // 古铜（偏将铜牌）
        bronze: {
          400: '#B08D57',
          500: '#8C6B3F',
          600: '#6B4E2C',
        },
        // 火漆朱红
        cinnabar: '#8E2B22',
      },
      fontFamily: {
        // 书法标题字体：优先本机华文行楷（Windows 自带），macOS 行楷，再回退到 Google Fonts 毛笔体
        calligraphy: ['"STXingkai"', '"华文行楷"', '"Xingkai SC"', '"Ma Shan Zheng"', '"Zhi Mang Xing"', '"Noto Serif SC"', 'serif'],
        serifcn: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 18px rgba(212,175,55,0.35), 0 0 42px rgba(212,175,55,0.12)',
        'gold-edge': '0 0 0 1px rgba(212,175,55,0.55), 0 0 24px rgba(212,175,55,0.25)',
      },
    },
  },
  plugins: [],
}
