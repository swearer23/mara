import * as path from "path";
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import css from "rollup-plugin-import-css";
import replace from '@rollup/plugin-replace';
import sourcemaps from 'rollup-plugin-sourcemaps';
const version = require('./package.json').version;

const output = [
  {
    dir: path.resolve(__dirname, 'dist/'),
    entryFileNames: `mara.esm.js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    format: 'esm',
    name: 'Mara',
    exports: 'named',
    externalLiveBindings: false,
    freeze: false,
    sourcemap: true
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
    freeze: false,
    sourcemap: true
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
    sourcemaps(),
    nodeResolve({
      preferBuiltins: true,
      browser: true
    }),
    replace({
      'process.env.mara_version': version,
      preventAssignment: true,
      include: ['src/**/*.js'],
      'process.env.DEBUG': process.env.DEBUG || false,
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
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      openPage: '/demo/demo.html',
    }),
  ],
};

export default config;
