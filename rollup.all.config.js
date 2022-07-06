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
  }],
 
  external:id => {
    // 需要把sweetalert2打包到库 进行es6转换
    return id.includes('sweetalert2')?false:id.includes('node_modules')
  }
};


const config = Object.assign({},baseConfig, outConfig)
// console.log('config2',config)

export default config;
