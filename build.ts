import { context } from "esbuild";
import { wasmLoader } from "esbuild-plugin-wasm";
import { copy } from "esbuild-plugin-copy";
import stylePlugin from "esbuild-style-plugin";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
import svgPlugin from "esbuild-svg";
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

const chrome = Bun.argv.length > 2 ? Bun.argv[2] !== "--firefox" : true;

const chromeManifestPath = "./configs/manifests/chrome.json";
const firefoxManifestPath = "./configs/manifests/firefox.json";

console.log(`Building extension for ${chrome ? "Chrome" : "Firefox"}...`);

const ctx = await context({
  entryPoints: {
    background: "src/background/index.ts",
    "content-script": "src/content-script/index.ts",
    pageProvider: "src/content-script/pageProvider/index.ts",
    ui: "src/ui/index.tsx",
  },
  outdir: chrome ? "dist/chrome" : "dist/firefox",
  minify: false,
  jsxDev: true,
  bundle: true,
  logLevel: "info",
  plugins: [
    svgPlugin({
      typescript: true,
    }),
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
    copy({
      assets: {
        from: [chrome ? chromeManifestPath : firefoxManifestPath],
        to: ["./manifest.json"],
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
