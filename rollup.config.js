import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import postcssImport from "postcss-import";
import { visualizer } from "rollup-plugin-visualizer";
import replace from "@rollup/plugin-replace";

const packageJson = require("./package.json");
const isProduction = process.env.NODE_ENV === "production";

export default [
	{
		input: "src/index.ts",
		output: [
			{
				dir: "dist",
				entryFileNames: "index.js",
				chunkFileNames: "chunks/[name]-[hash].js",
				format: "cjs",
				sourcemap: !isProduction,
				exports: "named",
			},
			{
				dir: "dist",
				entryFileNames: "index.mjs",
				chunkFileNames: "chunks/[name]-[hash].mjs",
				format: "esm",
				sourcemap: !isProduction,
				exports: "named",
			},
		],
		plugins: [
			peerDepsExternal(),
			replace({
				preventAssignment: true,
				values: {
					"process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
				},
			}),
			resolve(),
			commonjs(),
			typescript({ tsconfig: "./tsconfig.json" }),
			terser({
				format: {
					comments: false,
				},
				compress: {
					drop_console: isProduction,
					drop_debugger: isProduction,
					pure_funcs: ["console.info", "console.warn"],
				},
				mangle: {
					toplevel: true,
				},
			}),
			postcss({
				plugins: [postcssImport()],
				inject: true,
				minimize: true,
			}),
			visualizer({
				open: false,
				gzipSize: true,
				brotliSize: true,
				filename: "bundle-analysis.html",
			}),
		],
		external: ["react", "react-dom"],
	},
	{
		input: "src/index.ts",
		output: [{ file: packageJson.types }],
		plugins: [dts.default()],
		external: [/\.css$/],
	},
];
