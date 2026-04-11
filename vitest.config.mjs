import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src', 'shared'),
    },
  },
  test: {
    exclude: ['**/node_modules/**', '**/.git/**', '**/_site/**', '**/.11ty-vite/**'],
  },
})
