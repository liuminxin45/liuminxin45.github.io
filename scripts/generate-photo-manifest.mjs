import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const photosDir = path.join(rootDir, 'public', 'photos')
const outputFile = path.join(rootDir, 'src', 'data', 'photos.generated.ts')
const metadataFile = path.join(photosDir, 'photos.json')
const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

function readMetadata() {
  try {
    const content = readFileSync(metadataFile, 'utf8')
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed.photos)) {
      return new Map(parsed.photos.map(item => [item.file, item]))
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`[photos] ignored invalid metadata: ${metadataFile}`)
    }
  }

  return new Map()
}

function titleFromFile(file) {
  return path
    .basename(file, path.extname(file))
    .replace(/^\d{4}[-_.]\d{2}[-_.]\d{2}[-_\s]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) {
    return { data: {}, body: markdown }
  }

  const end = markdown.indexOf('\n---', 4)
  if (end === -1) {
    return { data: {}, body: markdown }
  }

  const data = {}
  const raw = markdown.slice(4, end).trim()
  for (const line of raw.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (match) {
      data[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim()
    }
  }

  return { data, body: markdown.slice(end + 4).trim() }
}

function markdownToHtml(markdown) {
  const blocks = markdown.split(/\n{2,}/).map(block => block.trim()).filter(Boolean)

  return blocks.map(block => {
    if (block.startsWith('### ')) {
      return `<h3>${inlineMarkdown(block.slice(4))}</h3>`
    }
    if (block.startsWith('## ')) {
      return `<h2>${inlineMarkdown(block.slice(3))}</h2>`
    }
    if (block.startsWith('# ')) {
      return `<h1>${inlineMarkdown(block.slice(2))}</h1>`
    }
    if (block.startsWith('> ')) {
      return `<blockquote>${inlineMarkdown(block.replace(/^>\s?/gm, ' '))}</blockquote>`
    }
    if (/^[-*]\s/m.test(block)) {
      const items = block
        .split('\n')
        .filter(line => /^[-*]\s/.test(line))
        .map(line => `<li>${inlineMarkdown(line.replace(/^[-*]\s/, ''))}</li>`)
        .join('')
      return `<ul>${items}</ul>`
    }

    return `<p>${inlineMarkdown(block).replace(/\n/g, '<br />')}</p>`
  }).join('\n')
}

function excerptFromMarkdown(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`>#-]/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ')
    .slice(0, 120)
}

function slugFromFile(file) {
  return path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function dateFromFile(file) {
  const match = file.match(/(\d{4})[-_.](\d{2})[-_.](\d{2})/)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : ''
}

function sortKey(date, file) {
  if (date) {
    return date.replaceAll('.', '-')
  }

  return dateFromFile(file) || '0000-00-00'
}

function readMarkdownFor(file) {
  const parsed = path.parse(file)
  const markdownPath = path.join(photosDir, parsed.dir, `${parsed.name}.md`)

  if (!existsSync(markdownPath)) {
    return { data: {}, body: '', html: '', excerpt: '' }
  }

  const raw = readFileSync(markdownPath, 'utf8')
  const parsedMarkdown = parseFrontmatter(raw)

  return {
    ...parsedMarkdown,
    html: markdownToHtml(parsedMarkdown.body),
    excerpt: excerptFromMarkdown(parsedMarkdown.body),
  }
}

function collectImages(dir, base = '') {
  let files = []

  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'photos.json') {
      continue
    }

    const absolute = path.join(dir, name)
    const relative = path.join(base, name)
    const stats = statSync(absolute)

    if (stats.isDirectory()) {
      files = files.concat(collectImages(absolute, relative))
      continue
    }

    if (stats.isFile() && imageExts.has(path.extname(name).toLowerCase())) {
      files.push(relative.replaceAll(path.sep, '/'))
    }
  }

  return files.sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

mkdirSync(photosDir, { recursive: true })
mkdirSync(path.dirname(outputFile), { recursive: true })

const metadata = readMetadata()
const photos = collectImages(photosDir).map((file, index) => {
  const item = metadata.get(file) ?? {}
  const article = readMarkdownFor(file)
  const title = article.data.title || item.title || titleFromFile(file) || `照片 ${index + 1}`
  const date = article.data.date || item.date || dateFromFile(file)
  const place = article.data.place || item.place || ''

  return {
    src: `photos/${file}`,
    file,
    slug: article.data.slug || item.slug || slugFromFile(file),
    title,
    alt: article.data.alt || item.alt || title,
    date,
    place,
    excerpt: article.data.excerpt || item.excerpt || article.excerpt,
    contentHtml: article.html,
    sortKey: sortKey(date, file),
  }
}).sort((a, b) => b.sortKey.localeCompare(a.sortKey) || b.file.localeCompare(a.file, 'zh-CN'))

const output = `// This file is generated by scripts/generate-photo-manifest.mjs.
// Do not edit it manually. Add photos to public/photos instead.

export type PhotoItem = {
  src: string
  file: string
  slug: string
  title: string
  alt: string
  date: string
  place: string
  excerpt: string
  contentHtml: string
  sortKey: string
}

export const photos: PhotoItem[] = ${JSON.stringify(photos, null, 2)}
`

writeFileSync(outputFile, output)
console.log(`[photos] generated ${photos.length} photo(s)`)
