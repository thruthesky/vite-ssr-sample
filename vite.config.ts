import { defineConfig } from "vite";
import viteSSR from "vite-ssr/plugin";
import vue from "@vitejs/plugin-vue";
// const api = require("../node-server/api");

export default defineConfig({
  plugins: [
    viteSSR(),
    vue(),
    // {
    //   // Mock API during development
    //   configureServer({ middlewares }) {
    //     api.forEach(({ route, handler }) => middlewares.use(route, handler));
    //   },
    // },
  ],
});
