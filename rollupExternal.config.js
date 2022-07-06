import * as path from "path";
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import css from "rollup-plugin-import-css";
import replace from '@rollup/plugin-replace';
// import autoExternal from 'rollup-plugin-auto-external';

const config = {
  input: {
    index: path.resolve(__dirname, 'src/index.js'),
  },
  output: [{
    dir: path.resolve(__dirname, 'dist/'),
    entryFileNames: `mara.all.umd.js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    format: 'umd',
    name: 'Mara',
    exports: 'default',
    externalLiveBindings: false,
    freeze: false
  }, {
    dir: path.resolve(__dirname, 'dist/'),
    entryFileNames: `mara.all.esm.js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    format: 'esm',
    name: 'Mara',
    exports: 'named',
    externalLiveBindings: false,
    freeze: false
  }],
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
      exclude:/node_modules\/(?!sweetalert2)/,
    "presets": [
      ["@babel/preset-env"]],
    }),
    
    terser(),
    // !process.argv.includes('-w') && autoExternal( ),
    process.argv.indexOf('-w') !== -1 && serve({
      open: true,
      port: 80,
      openPage: '/demo/demo.html',
    }),
  ],
  external:id => {
    // 需要把sweetalert2打包到库 进行es6转换
    return id.includes('sweetalert2')?false:id.includes('node_modules')
    
  }
};

export default config;
