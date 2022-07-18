import * as path from "path";
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import css from "rollup-plugin-import-css";
import replace from '@rollup/plugin-replace';

const baseConfig = {
  input: {
    index: path.resolve(__dirname, 'src/index.js'),
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
    commonjs({
      extensions: ['.js'],
      ignoreDynamicRequires: true,
    }),
    replace({
      preventAssignment: true,
      include: ['src/**/*.js'],
      'process.env.DEBUG': process.env.DEBUG || false
    }),
    css(),
    babel({
      babelHelpers: 'bundled',
      // exclude: "node_modules/**",
      // exclude:/node_modules\/(?!sweetalert2)/,
    "presets": [
      ["@babel/preset-env"]],
    }),
    
    terser(),
    process.argv.indexOf('-w') !== -1 && serve({
      open: true,
      port: 80,
      openPage: '/demo/demo.html',
    }),
  ],
};

export default baseConfig;
