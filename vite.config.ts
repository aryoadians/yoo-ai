import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command }) => ({
  // GitHub Pages menyajikan project ini di subpath /yoo-ai/, tapi dev server tetap di root
  // supaya alur `npm run dev` yang sudah dipakai selama ini tidak berubah.
  base: command === "build" ? "/yoo-ai/" : "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "profile.png"],
      manifest: {
        name: "Yoo.ai — Rekomendasi Tools AI",
        short_name: "Yoo.ai",
        lang: "id",
        description:
          "Temukan tool AI paling cocok untuk kebutuhanmu, lintas vendor dan lintas kategori — 100% berjalan di browser, tanpa server dan tanpa akun.",
        theme_color: "#2b4c8c",
        background_color: "#ffffff",
        display: "standalone",
        start_url: ".",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // Semua fitur inti Yoo.ai murni client-side (PRD bagian 7) — jadi cukup precache
        // seluruh build output, tidak perlu runtime caching untuk request jaringan apa pun.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
      },
    }),
  ],
  test: {
    environment: "node",
  },
}));
