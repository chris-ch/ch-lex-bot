const fs = require('fs');
const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          isCustomElement: tag => tag.startsWith('hanko-')
        };
        return options;
      });
  },
  devServer: {
    host: process.env.VUE_APP_HOST,
    port: 8443,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.resolve(__dirname, process.env.VUE_APP_SSL_KEY)),
        cert: fs.readFileSync(path.resolve(__dirname, process.env.VUE_APP_SSL_CERT)),
      }
    }
  }
})
