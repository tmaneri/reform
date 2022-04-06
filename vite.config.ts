import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { resolve } from "path";

const packageName = process.env.npm_package_name;

import { visualizer } from "rollup-plugin-visualizer";

export default () => {
  const plugins = [vue()];

  if (process.env.BUILD_REPORT) {
    plugins.push(visualizer());
  }

  return defineConfig({
    plugins,
    // resolve: {
    //   dedupe: ["vue"],
    // },
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: packageName,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["vue"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
          },
        },
      },
    },
  });
};
