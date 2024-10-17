import { defineConfig } from '@vue/cli-service';
import { fs } from 'fs';
import { path } from 'path';

export default defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        compilerOptions = {
          isCustomElement: tag => tag.startsWith('hanko-')
        }
        return options
      })
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
