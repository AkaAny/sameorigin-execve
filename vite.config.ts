import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import babel from "vite-plugin-babel"
import babelPlugin from 'vite-plugin-babel'
import * as babelTypes from '@babel/types';
import {transformAsync} from '@babel/core'
import {WindowProxyBabelPlugin} from "./babel-plugin-execve/src/babel-plugin";
import magic from "./babel-plugin-execve/src/magic";

function doTransformFile(code:string,id:string) {
  if (id.indexOf('.js') === -1 && id.indexOf(".ts")===-1) {
    return;
  }
  console.log("prepare to transform:",id);
  return transformAsync(code, {
    filename:id,
    babelrc: false,
    configFile: false,
    presets: [
       ['@babel/preset-env', {modules: false}],
       '@babel/preset-typescript'
    ],
    plugins: [
      WindowProxyBabelPlugin(babelTypes)
    ],
    //sourceMaps: 'inline'
  }).then((result)=> {
    // if(code.indexOf("changeLocation")>-1){
    //   console.log("has changeLocation id:",id);
    // }
    let newCode=result!!.code;
    newCode=`${magic}if(!window.windowProxy){console.log("[proxy] use origin window as a fallback");window.windowProxy=window;}${newCode}`
    return {
      code: newCode,
      map: result!!.map
    }
  });
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    // babel({
    //   babelConfig:{
    //     plugins:[
    //         WindowProxyBabelPlugin(babelTypes),
    //     ]
    //   }
    // }),
    {
      name: 'vite-transform-plugin',
      transform(code, id) {
        console.warn("id:", id);
        return doTransformFile(code,id);
      }
    },
  ],
  server:{
    port:7005,
    cors:true,
  }
})
