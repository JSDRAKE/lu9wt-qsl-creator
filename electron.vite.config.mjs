import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    define: {
      // Expose process.env to the renderer process
      'process.env': {}
    },
    build: {
      rollupOptions: {
        external: ['electron'],
        output: {
          // This will make sure our preload script works correctly
          format: 'es',
          inlineDynamicImports: true
        }
      }
    }
  }
})
