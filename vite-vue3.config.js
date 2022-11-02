import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/const 
const path = require("path");
export default defineConfig({
  plugins: [vue()],
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