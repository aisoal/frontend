import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import AutoImport from "unplugin-auto-import/vite";
import chakraImports from "./imports-chakra-ui.json";
import reactRouterDomImports from "./imports-react-router-dom.json";
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    visualizer({
      filename: "dist/stats.html",
      template: "treemap",
    }),
    react(),
    wasm(),
    AutoImport({
      imports: [
        "react",
        {
          "@chakra-ui/react": chakraImports,
          "react-router-dom": reactRouterDomImports,
        },
      ],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
      dts: false,
      dirs: ["src/helpers", "src/hooks", "src/components/CloudinaryImage"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 9999,
    open: true,
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
