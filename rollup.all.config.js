import * as path from "path";

import baseConfig from './rollup.base.config.js'

const outConfig = {
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
  }]
};


const config = Object.assign({},baseConfig, outConfig)

export default config;
