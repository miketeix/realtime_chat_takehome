/// <reference types="vitest/config" />

import { defineConfig } from 'vitest/config';
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000,
    allowedHosts: [".ngrok-free.app"]
  },
  test: {
    environment: 'jsdom',
  }
});
