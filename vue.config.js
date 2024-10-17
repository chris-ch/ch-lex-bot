const fs = require('fs');
const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

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
    host: 'lex-bot.streamlit.app',
    port: 8443,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.resolve(__dirname, '.certs/localhost+3-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '.certs/localhost+3.pem')),
      }
    }
  }
})
