import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import babel from "vite-plugin-babel"
import babelPlugin from 'vite-plugin-babel'
import * as babelTypes from '@babel/types';
import {transformAsync} from '@babel/core'
import {vitePluginExecveBabel} from "../vite-plugin-execve-babel/src/vite-plugin";

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
    vitePluginExecveBabel(),
  ],
  server:{
    port:7005,
    cors:true,
  }
})
