import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Espace Cameroon",
        short_name: "EspaceCM",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0C4B0CFF",
        icons: [
          {
            src: "./src/assets/images/logo/favi_logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./src/assets/images/logo/favi_logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/components'
    }
  },
  define: {
    "import.meta.env": process.env,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/vue")) {
            return "vue";
          }
          if (id.includes("node_modules/vue-router")) {
            return "vue-router";
          }
          if (id.includes("node_modules/pinia")) {
            return "pinia";
          }
          if (id.includes("node_modules/vue-toastification")) {
            return "vue-toastification";
          }
          if (id.includes("node_modules/axios")) {
            return "axios";
          }
          if (id.includes("src/views") || id.includes("src/components")) {
            return "app-components";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1100,
  },
});
