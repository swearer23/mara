import * as path from "path";
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import css from "rollup-plugin-import-css";
import replace from '@rollup/plugin-replace';
import autoExternal from 'rollup-plugin-auto-external';

const output = [
  {
    dir: path.resolve(__dirname, 'dist/'),
    entryFileNames: `mara.esm.js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    format: 'esm',
    name: 'Mara',
    exports: 'named',
    externalLiveBindings: false,
    freeze: false
  }
]

if (process.argv.indexOf('-w') === -1) {
  output.push({
    dir: path.resolve(__dirname, 'dist/'),
    entryFileNames: `mara.umd.js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    format: 'umd',
    name: 'Mara',
    exports: 'default',
    externalLiveBindings: false,
    freeze: false
  })
}

const config = {
  input: {
    index: path.resolve(__dirname, 'src/index.js'),
  },
  output: output,
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
    replace({
      preventAssignment: true,
      include: ['src/**/*.js'],
      'process.env.DEBUG': process.env.DEBUG || false
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
    process.argv.indexOf('-w') === -1 && autoExternal(),
    process.argv.indexOf('-w') !== -1 && serve({
      open: true,
      port: 8888,
      openPage: '/demo/demo.html',
    }),
  ],
};

export default config;
