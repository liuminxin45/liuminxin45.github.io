import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const indexFile = path.join(rootDir, 'dist', 'index.html')
const fallbackFile = path.join(rootDir, 'dist', '404.html')

if (!existsSync(indexFile)) {
  throw new Error('dist/index.html does not exist. Run vite build first.')
}

copyFileSync(indexFile, fallbackFile)
console.log('[pages] generated dist/404.html for SPA fallback')
