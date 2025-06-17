import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // 默认基础路径
  server: {
    port: 5173, // 默认端口
    open: true, // 自动打开浏览器
  },
});