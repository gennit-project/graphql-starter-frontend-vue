import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// const path = require("path");



// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'env');

  const htmlPlugin = () => ({
    // Source: https://github.com/Taiwan-Ebook-Lover/Taiwan-Ebook-Lover.github.io/pull/62#discussion_r886052909
    name: "html-transform",
    transformIndexHtml: html =>
      html.replace(
        /<%=\s*([a-zA-Z_]+)\s*%>/g,
        (_match, variableName) => env[variableName]
      )
  });
  return {
    plugins: [vue(), viteCommonjs(), htmlPlugin()],
    optimizeDeps: {
      include: ['luxon']
    },
    // esbuildOptions: {
    //   plugins: [esbuildCommonjs('luxon')]
    // },
    commonjsOptions: {
      include: [/node_modules/]
    },
    resolve: {
      alias: {
        "@": '/src'
      },
    },
  }
})