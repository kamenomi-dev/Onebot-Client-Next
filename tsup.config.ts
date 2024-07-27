import { defineConfig } from "tsup";

export default defineConfig({
  tsconfig: "./tsconfig.json",
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  outDir: "./lib/",
  splitting: true,
  dts: true,
  clean: true,
});
