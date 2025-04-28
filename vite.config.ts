import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve' // 'serve' = vite dev, 'build' = vite build

  return {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // ⬇️ only include HTTPS + custom host/port while running `vite dev`
    ...(isDev && {
      server: {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, '.certs/localhost.key')),
          cert: fs.readFileSync(
            path.resolve(__dirname, '.certs/localhost.crt'),
          ),
        },
        host: process.env.VITE_HOST || 'localhost',
        port: Number(process.env.VITE_PORT) || 8443,
      },
    }),
  }
})
