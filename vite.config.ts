import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // GitHub Pages menyajikan project ini di subpath /yoo-ai/, tapi dev server tetap di root
  // supaya alur `npm run dev` yang sudah dipakai selama ini tidak berubah.
  base: command === "build" ? "/yoo-ai/" : "/",
  plugins: [react()],
  test: {
    environment: "node",
  },
}));
