import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import { qrcode } from "vite-plugin-qrcode";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
  // tailwind.config.js
  extend: {
    animation: {
      "spin-slow": "spin 3s linear infinite",
    },
    keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
  },
});



// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//    server: {
//     host: true,      // 👈 allow external access
//     port: 5173
//   },
//   // tailwind.config.js
//   extend: {
//     animation: {
//       "spin-slow": "spin 3s linear infinite",
//     },
//   },
// });
