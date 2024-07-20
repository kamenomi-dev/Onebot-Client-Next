import typescript from "@rollup/plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "lib/iondex.js",
      format: "cjs",
    },
    {
      file: "lib/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    commonjs({
      include: /node_modules/,
    }),
    // terser(),
    resolve(),
  ],
};
