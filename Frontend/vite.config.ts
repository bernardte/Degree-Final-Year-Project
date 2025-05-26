import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    allowedHosts: ["8676-180-74-224-96.ngrok-free.app"],
  },
});
