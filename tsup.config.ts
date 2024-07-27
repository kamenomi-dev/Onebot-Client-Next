import { defineConfig } from "tsup";

export default defineConfig({
  tsconfig: "./tsconfig.json",
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  outDir: "./lib/",
  splitting: false,
  dts: true,
  clean: true,
});
