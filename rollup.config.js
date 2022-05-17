import * as path from "path";
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import css from "rollup-plugin-import-css";

const config = {
  input: {
    index: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    dir: path.resolve(__dirname, 'dist/'),
    entryFileNames: `mara.es.js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    format: 'es',
    exports: 'named',
    externalLiveBindings: false,
    freeze: false,
  },
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  plugins: [
    process.argv.indexOf('-w') > -1 && livereload(),
    nodeResolve({
      preferBuiltins: true,
      browser: true
    }),
    css(),
    babel({
      babelHelpers: 'bundled',
      exclude: "node_modules/**",
    }),
    commonjs({
      extensions: ['.js'],
      ignoreDynamicRequires: true,
    }),
    terser(),
    process.argv.indexOf('-w') !== -1 && serve({
      open: true,
      port: 8888,
      openPage: '/demo/demo.html',
    }),
  ],
};

export default config;
