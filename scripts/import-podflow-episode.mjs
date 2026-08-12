import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const content = path.join(root, 'public', 'podflow-studio')
const input = process.argv[2] && path.resolve(process.argv[2])
if (!input || !existsSync(path.join(input, 'episode.json'))) {
  throw new Error('Usage: npm run podflow:import -- <showcase-episode-directory>')
}

const episode = JSON.parse(readFileSync(path.join(input, 'episode.json'), 'utf8'))
if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(episode.id || '')) throw new Error('A revision-suffixed immutable episode id is required')
if (episode.qualityProfile !== 'podflow_morning_v3') throw new Error('Only podflow_morning_v3 packages can be imported')
if (episode.approval?.status !== 'approved' || episode.approval.audio_sha256 !== episode.audioSha256) throw new Error('Current human approval is required')
if (new URL(episode.audioUrl).hostname !== 'www.liuminxin.cn') throw new Error('Audio must use www.liuminxin.cn')
if (!Array.isArray(episode.sources) || !episode.sources.length || !Array.isArray(episode.musicCredits) || !episode.musicCredits.length) throw new Error('Sources and music rights are required')

const finalDir = path.join(content, 'episodes', episode.id)
if (existsSync(finalDir)) throw new Error(`Refusing to overwrite immutable episode ${episode.id}`)
const stagingRoot = path.join(content, `.import-${episode.id}-${Date.now()}`)
const stagingDir = path.join(stagingRoot, episode.id)
mkdirSync(stagingRoot, { recursive: true })
cpSync(input, stagingDir, { recursive: true, errorOnExist: true })

const manifestPath = path.join(content, 'episodes.json')
const originalManifest = readFileSync(manifestPath, 'utf8')
const episodes = JSON.parse(originalManifest)
const next = [episode, ...episodes.filter(item => item.id !== episode.id)]
const manifestTemp = `${manifestPath}.import-tmp`

try {
  mkdirSync(path.dirname(finalDir), { recursive: true })
  renameSync(stagingDir, finalDir)
  writeFileSync(manifestTemp, JSON.stringify(next, null, 2) + '\n', 'utf8')
  renameSync(manifestTemp, manifestPath)
  const validation = spawnSync(process.execPath, [path.join(root, 'scripts', 'generate-podflow-content.mjs')], { cwd: root, stdio: 'inherit' })
  if (validation.status !== 0) throw new Error('Imported package failed content validation')
  rmSync(stagingRoot, { recursive: true, force: true })
  console.log(`[podflow] imported ${episode.id}`)
} catch (error) {
  writeFileSync(manifestPath, originalManifest, 'utf8')
  rmSync(finalDir, { recursive: true, force: true })
  rmSync(stagingRoot, { recursive: true, force: true })
  throw error
}
