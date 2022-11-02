import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";

// https://vitejs.dev/config/const 
const path = require("path");
export default defineConfig({
  plugins: [vue2()],
  resolve: {
    extensions: [
      ".mjs",
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
      ".vue",
      ".scss",
    ],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8888,
  },
});