import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [],
  test: {
    environment: "happy-dom",
    globals: true,
    browser: {
      provider: "playwright",
      enabled: false,
      instances: [{ browser: "chromium" }],
      viewport: { width: 320, height: 240 },
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
