import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // This server proxy is added to route API requests
  // from your React app to your backend server during development.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true,
      },
    },
  },
})

