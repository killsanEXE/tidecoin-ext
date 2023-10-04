import { context } from "esbuild";
import { wasmLoader } from "esbuild-plugin-wasm";
import { copy } from "esbuild-plugin-copy";
import stylePlugin from "esbuild-style-plugin";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

const ctx = await context({
  entryPoints: {
    background: "src/background/index.ts",
    "content-script": "src/content-script/index.ts",
    pageProvider: "src/content-script/pageProvider/index.ts",
    ui: "src/ui/index.tsx",
  },
  outdir: "dist",
  minify: true,
  bundle: true,
  jsx: "transform",
  plugins: [
    stylePlugin({
      postcss: {
        plugins: [autoprefixer(), tailwindcss()],
      },
    }),
    wasmLoader(),
    copy({
      assets: {
        from: ["./configs/_raw/**/*"],
        to: ["."],
      },
    }),
    nodeModulesPolyfillPlugin({
      globals: {
        Buffer: true,
      },
      modules: {
        buffer: true,
      },
    }),
  ],
});

await ctx.watch();
