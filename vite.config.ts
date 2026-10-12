import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cpSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), {
    name: 'public-assets-without-private-previews',
    closeBundle() {
      const source = resolve('public');
      if (!existsSync(source)) return;
      for (const name of readdirSync(source)) {
        if (name !== 'local-preview') cpSync(resolve(source, name), resolve('dist', name), { recursive: true });
      }
    },
  }],
  build: { copyPublicDir: false },
})
