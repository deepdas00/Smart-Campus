import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // tailwind.config.js
  extend: {
    animation: {
      "spin-slow": "spin 3s linear infinite",
    },
  },
});
