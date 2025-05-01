import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import fs from 'fs'
import path from 'path'
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    base: '/',
    build: {
      rollupOptions: {
        input: 'index.v3.html',
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      // 👇 Only run during build, not dev
      !isDev && {
        name: 'inject-build-comment',
        closeBundle() {
          const file = path.resolve(__dirname, 'dist/index.html')
          if (fs.existsSync(file)) {
            const html = fs.readFileSync(file, 'utf-8')
            const tag = `<!-- build: ${new Date().toISOString()} -->`
            fs.writeFileSync(
              html.includes('<head>')
                ? file.replace(/<head>/, `<head>\n  ${tag}`)
                : file,
              html,
            )
          }
        },
      },
    ].filter(Boolean), // filters out `false` if isDev
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
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
