/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // 👈 一定要加上这一行！
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 扫描 Vue 组件与 TS 文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
