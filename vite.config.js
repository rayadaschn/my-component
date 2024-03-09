import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import htmlConfig from "vite-plugin-html-config";
import { viteExternalsPlugin } from "vite-plugin-externals";

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const externalConfig = viteExternalsPlugin({
    cesium: "Cesium",
  });
  const htmlConfigs = htmlConfig({
    viteNext: true,
    headScripts: [
      {
        src: "./lib/cesium/Cesium.js",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "./lib/cesium/Widgets/widgets.css",
      },
    ],
  });

  return {
    plugins: [vue(), externalConfig, htmlConfigs],
  };
});
