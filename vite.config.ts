import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "pwa-icon.svg", "og-image.svg"],
      manifest: {
        name: "Caret — Precision tools, in your pocket",
        short_name: "Caret",
        description:
          "300+ free in-browser utilities for developers, designers and makers. Nothing leaves your device.",
        theme_color: "#4f46e5",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
        categories: ["productivity", "utilities", "developer"],
      },
      workbox: {
        // App is small + assets are hashed → cache aggressively.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("/react-dom/") || id.includes("/react/") || id.includes("scheduler") || id.includes("@radix-ui")) return "vendor-react";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("cmdk") || id.includes("sonner") || id.includes("next-themes") || id.includes("react-helmet")) return "vendor-ui";
        },
      },
    },
  },
});
