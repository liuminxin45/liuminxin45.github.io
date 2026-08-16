import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const RELEASE_REPOSITORY = 'liuminxin45/podflow-morning-feed'
export const REQUIRED_ASSETS = [
  'episode.json',
  'cover.png',
  'transcript.vtt',
  'chapters.json',
  'show-notes.md',
  'audio-quality-report.json',
  'checksums.sha256',
]

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(rootDir, 'public', 'podflow-studio')
const episodeIdPattern = /^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function githubHeaders(token = '') {
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'liuminxin45.github.io-podflow-sync',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function githubFetch(url, options = {}) {
  try {
    return await fetch(url, options)
  } catch (networkError) {
    const apiPrefix = 'https://api.github.com/'
    if (!String(url).startsWith(apiPrefix)) throw networkError
    const accept = options.headers?.Accept || 'application/vnd.github+json'
    const env = { ...process.env }
    const authorization = options.headers?.Authorization || ''
    if (authorization.startsWith('Bearer ')) env.GH_TOKEN = authorization.slice(7)
    try {
      const body = execFileSync('gh', ['api', String(url).slice(apiPrefix.length), '-H', `Accept: ${accept}`], {
        env,
        encoding: null,
        maxBuffer: 20 * 1024 * 1024,
      })
      return new Response(body, { status: 200 })
    } catch {
      throw networkError
    }
  }
}

async function responseBody(response, label) {
  if (!response.ok) throw new Error(`${label} failed with HTTP ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

function parseChecksums(buffer) {
  const checksums = new Map()
  for (const line of buffer.toString('utf8').replace(/\r\n/g, '\n').split('\n')) {
    if (!line.trim()) continue
    const match = /^([a-f0-9]{64})\s+\*?([^/\\]+)$/.exec(line.trim())
    if (!match) throw new Error(`Invalid checksums.sha256 line: ${line}`)
    if (checksums.has(match[2])) throw new Error(`Duplicate checksum entry: ${match[2]}`)
    checksums.set(match[2], match[1])
  }
  return checksums
}

function validateEpisode(episode, release, assets) {
  if (!episode || typeof episode !== 'object') throw new Error(`${release.tag_name}: episode.json must be an object`)
  if (episode.id !== release.tag_name || !episodeIdPattern.test(episode.id || '')) {
    throw new Error(`${release.tag_name}: release tag and episode id must match`)
  }
  if (episode.qualityProfile !== 'podflow_morning_v3') throw new Error(`${episode.id}: unsupported quality profile`)
  if (!/^[a-f0-9]{64}$/.test(episode.audioSha256 || '')) throw new Error(`${episode.id}: invalid audio SHA256`)
  if (episode.approval?.status !== 'approved' || episode.approval.audio_sha256 !== episode.audioSha256) {
    throw new Error(`${episode.id}: current human approval is required`)
  }
  if (!Array.isArray(episode.sources) || !episode.sources.length) throw new Error(`${episode.id}: sources are required`)
  if (!Array.isArray(episode.musicCredits) || !episode.musicCredits.length) throw new Error(`${episode.id}: music rights are required`)

  const audioName = `${episode.id}.mp3`
  const audio = assets.get(audioName)
  if (!audio) throw new Error(`${episode.id}: missing Release asset ${audioName}`)
  const expectedUrl = `https://github.com/${RELEASE_REPOSITORY}/releases/download/${episode.id}/${audioName}`
  if (episode.audioUrl !== expectedUrl || audio.browser_download_url !== expectedUrl) {
    throw new Error(`${episode.id}: audio URL must use the canonical Release asset`)
  }
  if (audio.size !== episode.audioBytes) throw new Error(`${episode.id}: audio size does not match episode.json`)
  if (audio.digest !== `sha256:${episode.audioSha256}`) throw new Error(`${episode.id}: GitHub audio digest does not match episode.json`)
}

export async function syncPodflowReleases({ fetchImpl = githubFetch, outputDir = contentDir, token = process.env.GITHUB_TOKEN || '' } = {}) {
  const headers = githubHeaders(token)
  const releasesUrl = `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases?per_page=100`
  const releasesResponse = await fetchImpl(releasesUrl, { headers })
  if (!releasesResponse.ok) throw new Error(`GitHub Releases request failed with HTTP ${releasesResponse.status}`)
  const releases = await releasesResponse.json()
  if (!Array.isArray(releases)) throw new Error('GitHub Releases response must be an array')

  const published = releases.filter(release => !release.draft && !release.prerelease)
  const seen = new Set()
  const episodes = []
  const pendingFiles = []

  for (const release of published) {
    if (!episodeIdPattern.test(release.tag_name || '')) throw new Error(`Invalid published episode tag: ${release.tag_name || '<empty>'}`)
    if (seen.has(release.tag_name)) throw new Error(`Duplicate published episode tag: ${release.tag_name}`)
    seen.add(release.tag_name)
    const assets = new Map((release.assets || []).map(asset => [asset.name, asset]))
    for (const name of [...REQUIRED_ASSETS, `${release.tag_name}.mp3`]) {
      if (!assets.has(name)) throw new Error(`${release.tag_name}: missing Release asset ${name}`)
    }

    const downloaded = new Map()
    for (const name of REQUIRED_ASSETS) {
      const asset = assets.get(name)
      const body = await responseBody(await fetchImpl(asset.url || asset.api_url || asset.browser_download_url, {
        headers: { ...headers, Accept: 'application/octet-stream' },
      }), `${release.tag_name}/${name}`)
      if (asset.size !== body.length) throw new Error(`${release.tag_name}/${name}: asset size mismatch`)
      if (asset.digest !== `sha256:${sha256(body)}`) throw new Error(`${release.tag_name}/${name}: asset digest mismatch`)
      downloaded.set(name, body)
    }

    const checksums = parseChecksums(downloaded.get('checksums.sha256'))
    for (const name of ['episode.json', 'cover.png', 'transcript.vtt', 'chapters.json', 'show-notes.md', 'audio-quality-report.json', `${release.tag_name}.mp3`]) {
      const asset = assets.get(name)
      const digest = name.endsWith('.mp3') ? asset.digest?.replace(/^sha256:/, '') : sha256(downloaded.get(name))
      if (checksums.get(name) !== digest) throw new Error(`${release.tag_name}/${name}: checksums.sha256 mismatch`)
    }

    const episode = JSON.parse(downloaded.get('episode.json').toString('utf8'))
    validateEpisode(episode, release, assets)
    episodes.push(episode)
    for (const name of REQUIRED_ASSETS.filter(name => name !== 'episode.json')) {
      pendingFiles.push({ episodeId: episode.id, name, body: downloaded.get(name) })
    }
  }

  episodes.sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
  const generatedEpisodesDir = path.join(outputDir, 'episodes')
  rmSync(generatedEpisodesDir, { recursive: true, force: true })
  mkdirSync(generatedEpisodesDir, { recursive: true })
  for (const file of pendingFiles) {
    const directory = path.join(generatedEpisodesDir, file.episodeId)
    mkdirSync(directory, { recursive: true })
    writeFileSync(path.join(directory, file.name), file.body)
  }
  writeFileSync(path.join(outputDir, 'episodes.json'), `${JSON.stringify(episodes, null, 2)}\n`, 'utf8')
  console.log(`[podflow] synced ${episodes.length} reviewed Release episode(s) from ${RELEASE_REPOSITORY}`)
  return episodes
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ''
if (import.meta.url === invokedPath) {
  syncPodflowReleases().catch(error => {
    console.error(`[podflow] Release sync failed: ${error.message}`)
    process.exitCode = 1
  })
}
