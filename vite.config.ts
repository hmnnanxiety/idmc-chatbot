import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // The frontend calls `/api/chat`; FastAPI serves `/chat`. The proxy also means the
      // backend needs no CORS setup in development. 127.0.0.1 (not `localhost`) avoids
      // Node resolving to ::1 while uvicorn listens on IPv4 only.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
