import { readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'public')
const contentDir = path.join(publicDir, 'podflow-studio')
const strict = process.argv.includes('--strict')

const channel = JSON.parse(readFileSync(path.join(contentDir, 'channel.json'), 'utf8'))
const episodes = JSON.parse(readFileSync(path.join(contentDir, 'episodes.json'), 'utf8'))

function publicUrl(value, field) {
  const parsed = new URL(value)
  if (parsed.protocol !== 'https:') throw new Error(`${field} must use HTTPS`)
  return value
}

for (const field of ['title', 'description', 'language', 'author', 'coverUrl', 'siteUrl', 'feedUrl']) {
  if (!channel[field]) throw new Error(`channel.${field} is required`)
}
for (const field of ['coverUrl', 'siteUrl', 'feedUrl']) publicUrl(channel[field], `channel.${field}`)
if (!Array.isArray(episodes)) throw new Error('episodes.json must be an array')
if (strict && episodes.length !== 10) throw new Error(`strict showcase requires exactly 10 episodes; found ${episodes.length}`)

const seen = new Set()
for (const episode of episodes) {
  for (const field of ['id', 'title', 'summary', 'publishedAt', 'audioUrl', 'coverUrl', 'transcriptUrl', 'chaptersUrl', 'ttsProvider']) {
    if (!episode[field]) throw new Error(`episode.${field} is required`)
  }
  if (!/^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(episode.id)) throw new Error(`invalid immutable episode id: ${episode.id}`)
  if (seen.has(episode.id)) throw new Error(`duplicate episode id: ${episode.id}`)
  seen.add(episode.id)
  for (const field of ['audioUrl', 'coverUrl', 'transcriptUrl', 'chaptersUrl']) publicUrl(episode[field], `episode.${field}`)
  if (!Number.isFinite(episode.durationSeconds) || episode.durationSeconds < 720 || episode.durationSeconds > 900) {
    throw new Error(`${episode.id}: durationSeconds must be within the 12 to 15 minute golden range`)
  }
  const minimumAudioBytes = Math.floor(episode.durationSeconds * 16_000)
  if (!Number.isInteger(episode.audioBytes) || episode.audioBytes < minimumAudioBytes) {
    throw new Error(`${episode.id}: audioBytes is too small for a 128 kbps public MP3`)
  }
  if (!Array.isArray(episode.sources) || episode.sources.length === 0) throw new Error(`${episode.id}: sources are required`)
  for (const source of episode.sources) {
    if (!source.title) throw new Error(`${episode.id}: source title is required`)
    publicUrl(source.url, `${episode.id}: source URL`)
  }
  if (!Array.isArray(episode.credits) || episode.credits.some(credit => !credit.role || !credit.name)) throw new Error(`${episode.id}: credits are invalid`)
  if (episode.ttsProvider !== '豆包 BigTTS') throw new Error(`${episode.id}: public episodes must use the fixed 豆包 BigTTS voice baseline`)
  if (episode.aiAssisted !== true || typeof episode.explicit !== 'boolean') throw new Error(`${episode.id}: disclosure fields are invalid`)

  const chapterUrl = new URL(episode.chaptersUrl)
  if (['liuminxin45.github.io', 'www.liuminxin.cn'].includes(chapterUrl.hostname)) {
    const chapterPath = path.join(publicDir, decodeURIComponent(chapterUrl.pathname).replace(/^\/+/, ''))
    const chapterDocument = JSON.parse(readFileSync(chapterPath, 'utf8'))
    const chapters = chapterDocument.chapters
    if (!Array.isArray(chapters) || chapters.length === 0) throw new Error(`${episode.id}: chapters are required`)
    let previous = -1
    for (const chapter of chapters) {
      if (!Number.isFinite(chapter.startTime) || chapter.startTime < 0 || chapter.startTime >= episode.durationSeconds || chapter.startTime <= previous) {
        throw new Error(`${episode.id}: chapter boundary is invalid`)
      }
      previous = chapter.startTime
    }
  }
}

if (strict) {
  const releaseDays = episodes.map(episode => Date.parse(`${episode.id.slice(0, 10)}T00:00:00Z`)).sort((a, b) => a - b)
  for (let index = 1; index < releaseDays.length; index += 1) {
    if (releaseDays[index] - releaseDays[index - 1] !== 86_400_000) {
      throw new Error('strict showcase requires 10 consecutive daily episode IDs')
    }
  }
}

const target = path.join(contentDir, 'feed.xml')
if (episodes.length === 0) {
  rmSync(target, { force: true })
  console.log('[podflow] validated an empty showcase; feed.xml is withheld until reviewed episodes exist')
  process.exit(0)
}

const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const items = episodes.map(episode => `    <item>
      <guid isPermaLink="false">${escapeXml(episode.id)}</guid>
      <title>${escapeXml(episode.title)}</title>
      <description>${escapeXml(episode.summary)}</description>
      <pubDate>${new Date(episode.publishedAt).toUTCString()}</pubDate>
      <itunes:duration>${Math.round(episode.durationSeconds)}</itunes:duration>
      <itunes:explicit>${episode.explicit}</itunes:explicit>
      <enclosure url="${escapeXml(episode.audioUrl)}" length="${episode.audioBytes}" type="audio/mpeg"/>
      <podcast:transcript url="${escapeXml(episode.transcriptUrl)}" type="text/vtt"/>
      <podcast:chapters url="${escapeXml(episode.chaptersUrl)}" type="application/json+chapters"/>
    </item>`).join('\n')

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(channel.language)}</language>
    <itunes:author>${escapeXml(channel.author)}</itunes:author>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${escapeXml(channel.coverUrl)}"/>
    <link>${escapeXml(channel.siteUrl)}</link>
${items}
  </channel>
</rss>
`
const temporary = `${target}.tmp`
writeFileSync(temporary, feed, 'utf8')
renameSync(temporary, target)
console.log(`[podflow] validated ${episodes.length} episode(s) and generated feed.xml${strict ? ' in strict mode' : ''}`)
