/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ธีมหลัก: Teal/Mint (สดชื่น, สะอาด, การแพทย์)
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // ธีมรอง: Warm Gray / Sand (ผ่อนคลาย, ธรรมชาติ) แทนสีม่วงเดิม
        secondary: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        // เพิ่มสีพื้นหลังแบบ Cream/Off-white
        background: {
          DEFAULT: '#FAFAFA',
          paper: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Sarabun', 'IBM Plex Sans Thai', 'sans-serif'],
        heading: ['IBM Plex Sans Thai', 'Sarabun', 'sans-serif'],
      },
    },
  },
  plugins: [],
};