import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(path.join(rootDir, 'dist', 'index.html'), 'utf8')
const episodes = JSON.parse(readFileSync(path.join(rootDir, 'public', 'podflow-studio', 'episodes.json'), 'utf8'))
const outputDir = path.join(rootDir, 'dist', 'works', 'podflow-studio')
const canonical = 'https://liuminxin45.github.io/works/podflow-studio'
const description = 'PodFlow Studio 是本地优先的 AI 新闻播客制作工作台，从可追溯素材、事实卡片和可编辑成稿，到配音、音频成片和 RSS 发布包。'
const jsonLd = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PodFlow Studio',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Windows',
    url: canonical,
    codeRepository: 'https://github.com/liuminxin45/podflow-studio',
    license: 'https://www.gnu.org/licenses/lgpl-3.0.html',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: 'PodFlow 晨报',
    url: canonical,
    ...(episodes.length ? { webFeed: 'https://liuminxin45.github.io/podflow-studio/feed.xml' } : {}),
  },
])

const meta = `
    <link rel="canonical" href="${canonical}" />
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="PodFlow Studio｜把每天的新闻做成一档节目" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://liuminxin45.github.io/images/podflow-studio/og.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="PodFlow Studio｜把每天的新闻做成一档节目" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="https://liuminxin45.github.io/images/podflow-studio/og.svg" />
    <script type="application/ld+json">${jsonLd}</script>`
const html = source
  .replace(/<title>.*?<\/title>/, '<title>PodFlow Studio｜把每天的新闻做成一档节目</title>')
  .replace(/\s*<meta name="description"[^>]*>/g, '')
  .replace(/\s*<meta property="og:(?:type|title|description|url|image)"[^>]*>/g, '')
  .replace(/\s*<meta name="twitter:(?:card|title|description|image)"[^>]*>/g, '')
  .replace(/\s*<link rel="canonical"[^>]*>/g, '')
  .replace('</head>', `${meta}\n  </head>`)
mkdirSync(outputDir, { recursive: true })
writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8')
console.log('[pages] generated static shell for /works/podflow-studio')
