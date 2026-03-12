import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "KasperLib",
        formats: isProd ? ["umd", "es"] : ["umd", "es"],
        fileName: (format) => {
          if (format === "es") return isProd ? "kasper.esm.min.js" : "kasper.esm.js";
          return isProd ? "kasper.min.js" : "kasper.js";
        },
      },
      outDir: "dist",
      sourcemap: isProd ? false : "inline",
      minify: isProd ? "esbuild" : false,
      emptyOutDir: false,
    },
    resolve: {
      alias: {
        "@kasper": resolve(__dirname, "src"),
      },
    },
    test: {
      environment: "happy-dom",
      globals: true,
      include: ["spec/**/*.spec.ts"],
    },
  };
});
