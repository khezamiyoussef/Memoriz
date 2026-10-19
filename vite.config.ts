import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Served from the domain root (memoriz.club), so published sites live at
  // memoriz.club/<slug>. VITE_BASE_PATH only matters if hosted under a sub-path.
  base: loadEnv(mode, process.cwd(), "").VITE_BASE_PATH || "/",

  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // SPA fallback for static hosts without rewrites (Vercel uses vercel.json instead)
    {
      name: "copy-index-to-404",
      closeBundle() {
        const indexPath = "dist/index.html";
        const notFoundPath = "dist/404.html";

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log("✔ SPA fallback created: dist/404.html");
        }
      },
    },
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
