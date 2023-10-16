import { context, build, BuildOptions } from "esbuild";
import { wasmLoader } from "esbuild-plugin-wasm";
import { copy } from "esbuild-plugin-copy";
import stylePlugin from "esbuild-style-plugin";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
import svgPlugin from "esbuild-svg";
import manifestPlugin from "esbuild-plugin-manifest";
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

async function readJsonFile(path: string) {
  const file = Bun.file(path);
  return await file.json();
}

const chrome = Bun.argv.length > 2 ? Bun.argv[2] !== "--firefox" : true;

const baseManifestPath = "./configs/manifests/base.json";
const chromeManifestPath = "./configs/manifests/chrome.json";
const firefoxManifestPath = "./configs/manifests/firefox.json";

const baseManifest = await readJsonFile(baseManifestPath);
const extraManifest = await readJsonFile(
  chrome ? chromeManifestPath : firefoxManifestPath
);

console.log(`\n💻 Current browser: ${chrome ? "Chrome" : "Firefox"}\n`);

const buildOptions: BuildOptions = {
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
    manifestPlugin({
      generate: () => ({
        ...baseManifest,
        ...extraManifest,
      }),
      hash: false,
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
};

if (Bun.argv.includes("--watch")) {
  const ctx = await context(buildOptions);
  await ctx.watch();
} else {
  await build(buildOptions);
}
