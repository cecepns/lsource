import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Path relatif agar CSS/JS tetap ketemu saat buka file lokal, subpath, atau static dari Express
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
  },
});
