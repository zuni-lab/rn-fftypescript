import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser  from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";
import external from "rollup-plugin-peer-deps-external";
import progress from "rollup-plugin-progress";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [
      del({ targets: "build/*" }),
      external(),
      resolve(),
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: ["**/__tests__/**", "__Template"],
        clean: true,
        typescript: require("ttypescript"),
        tsconfigDefaults: {
          compilerOptions: {
            plugins: [
              { transform: "typescript-transform-paths" },
              {
                transform: "typescript-transform-paths",
                afterDeclarations: true,
              },
            ],
          },
        },
      }),
      commonjs({
        include: ["node_modules/**"],
      }),
      terser({
        mangle: {
          eval: true,
          toplevel: true,
        },
        output: {
          comments: "some",
        },
      }),
      progress(),
    ],
  },
];
