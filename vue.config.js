module.exports = {
    css: {
      loaderOptions: {
        sass: {
          prependData: `@import "@/styles/_variables.scss";`,
        },
      },
    },
    // runtimeCompiler: true,
    chainWebpack: config => {
      config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => ({
          ...options,
          compilerOptions: {
            // treat any tag that starts with ion- as custom elements
            isCustomElement: tag => tag.startsWith('md-') || tag.startsWith('markdown-' || tag==="VDropdown")
          }
        }))
    }
  };
  