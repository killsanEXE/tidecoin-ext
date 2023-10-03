import { build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { wasmLoader } from "esbuild-plugin-wasm";

const result = await build({
  entryPoints: [
    "src/background/index.ts",
    "src/content-script/index.ts",
    "src/content-script/pageProvider/index.ts",
    "src/ui/index.tsx",
  ],
  outdir: "test",
  minify: false,
  bundle: true,
  plugins: [sassPlugin(), wasmLoader()],
});

console.log(result);
