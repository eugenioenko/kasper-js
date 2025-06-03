import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [],
  test: {
    environment: "jsdom",
    globals: true,
    browser: {
      provider: "playwright",
      enabled: true,
      instances: [{ browser: "chromium" }],
      viewport: { width: 640, height: 480 },
    },
    setupFiles: ["./tests/setup-tests.ts"],
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "src"),
    },
  },
  define: {
    global: {},
    process: {
      env: {},
    },
  },
});
