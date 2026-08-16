import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { RELEASE_REPOSITORY, syncPodflowReleases } from './sync-podflow-releases.mjs'

const digest = value => createHash('sha256').update(value).digest('hex')

function fixture({ draft = false, brokenAudioDigest = false, missingAsset = '' } = {}) {
  const id = '2026-08-17'
  const audioName = `${id}.mp3`
  const audioDigest = 'a'.repeat(64)
  const episode = {
    id,
    title: 'PodFlow 晨报',
    summary: '测试节目',
    publishedAt: '2026-08-17T08:00:00+08:00',
    durationSeconds: 780,
    audioUrl: `https://github.com/${RELEASE_REPOSITORY}/releases/download/${id}/${audioName}`,
    audioBytes: 15600000,
    coverUrl: `https://www.liuminxin.cn/podflow-studio/episodes/${id}/cover.png`,
    transcriptUrl: `https://www.liuminxin.cn/podflow-studio/episodes/${id}/transcript.vtt`,
    chaptersUrl: `https://www.liuminxin.cn/podflow-studio/episodes/${id}/chapters.json`,
    sources: [{ title: 'Source', url: 'https://example.com/source' }],
    credits: [{ role: '制作', name: 'PodFlow Studio' }],
    ttsProvider: '豆包 BigTTS',
    aiAssisted: true,
    explicit: false,
    qualityProfile: 'podflow_morning_v3',
    audioSha256: audioDigest,
    musicCredits: [{ title: 'Quick Spark', artist: 'Ondrosik', sourceUrl: 'https://example.com/music', license: 'CC0 1.0 Universal', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', edited: 'edited' }],
    approval: { status: 'approved', audio_sha256: audioDigest, reviewed_at: '2026-08-17T09:00:00Z', reviewer: 'Reviewer' },
  }
  const bodies = new Map([
    ['episode.json', Buffer.from(`${JSON.stringify(episode)}\n`)],
    ['cover.png', Buffer.from('cover')],
    ['transcript.vtt', Buffer.from('WEBVTT\n')],
    ['chapters.json', Buffer.from('{"version":"1.2.0","chapters":[{"startTime":0,"title":"开场"}]}\n')],
    ['show-notes.md', Buffer.from('# Notes\n')],
    ['audio-quality-report.json', Buffer.from('{"qualityProfile":"podflow_morning_v3"}\n')],
  ])
  const checksumLines = [...bodies].map(([name, body]) => `${digest(body)}  ${name}`)
  checksumLines.push(`${audioDigest}  ${audioName}`)
  bodies.set('checksums.sha256', Buffer.from(`${checksumLines.join('\n')}\n`))
  const assets = [...bodies].map(([name, body]) => ({ name, size: body.length, digest: `sha256:${digest(body)}`, browser_download_url: `https://assets.test/${name}` }))
  assets.push({ name: audioName, size: episode.audioBytes, digest: `sha256:${brokenAudioDigest ? 'b'.repeat(64) : audioDigest}`, browser_download_url: episode.audioUrl })
  const filteredAssets = assets.filter(asset => asset.name !== missingAsset)
  const releases = [{ tag_name: id, draft, prerelease: false, assets: filteredAssets }]
  const fetchImpl = async url => {
    if (String(url).includes('/releases?')) return new Response(JSON.stringify(releases), { status: 200 })
    const name = String(url).replace('https://assets.test/', '')
    return bodies.has(name) ? new Response(bodies.get(name), { status: 200 }) : new Response('', { status: 404 })
  }
  return { fetchImpl, id }
}

test('syncs reviewed releases without downloading the MP3', async () => {
  const outputDir = mkdtempSync(path.join(os.tmpdir(), 'podflow-site-'))
  const { fetchImpl, id } = fixture()
  const episodes = await syncPodflowReleases({ fetchImpl, outputDir })
  assert.equal(episodes.length, 1)
  assert.equal(JSON.parse(readFileSync(path.join(outputDir, 'episodes.json'), 'utf8'))[0].id, id)
  assert.equal(readFileSync(path.join(outputDir, 'episodes', id, 'transcript.vtt'), 'utf8'), 'WEBVTT\n')
})

test('ignores drafts and rejects incomplete or mismatched releases', async () => {
  const draftDir = mkdtempSync(path.join(os.tmpdir(), 'podflow-site-'))
  assert.equal((await syncPodflowReleases({ ...fixture({ draft: true }), outputDir: draftDir })).length, 0)
  await assert.rejects(syncPodflowReleases({ ...fixture({ missingAsset: 'chapters.json' }), outputDir: mkdtempSync(path.join(os.tmpdir(), 'podflow-site-')) }), /missing Release asset/)
  await assert.rejects(syncPodflowReleases({ ...fixture({ brokenAudioDigest: true }), outputDir: mkdtempSync(path.join(os.tmpdir(), 'podflow-site-')) }), /(?:audio digest|checksums\.sha256)/)
})
