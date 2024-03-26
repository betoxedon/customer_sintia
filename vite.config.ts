import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
   server: {
      port: 5176,
      sourcemapIgnoreList(sourcePath, sourcemapPath) {
         return sourcePath.includes('node_modules')
      },
   },
   build: { chunkSizeWarningLimit: 1600, sourcemap: true },
   define: {
      'process.env.BUILD_TIME': JSON.stringify(new Date().toLocaleString()),
   },
   plugins: [vue()],
   resolve: {
      alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
   },
})
