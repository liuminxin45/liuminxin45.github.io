export type PodFlowSource = { title: string; url: string }
export type PodFlowCredit = { role: string; name: string }
export type PodFlowMusicCredit = {
  title: string
  artist: string
  sourceUrl: string
  license: string
  licenseUrl: string
  edited: string
}

export type PodFlowEpisode = {
  id: string
  title: string
  summary: string
  publishedAt: string
  durationSeconds: number
  audioUrl: string
  audioBytes: number
  coverUrl: string
  transcriptUrl: string
  chaptersUrl: string
  sources: PodFlowSource[]
  credits: PodFlowCredit[]
  ttsProvider: string
  aiAssisted: boolean
  explicit: boolean
  qualityProfile: 'podflow_morning_v3'
  audioSha256: string
  musicCredits: PodFlowMusicCredit[]
}

export async function loadPodFlowEpisodes(signal?: AbortSignal): Promise<PodFlowEpisode[]> {
  const response = await fetch('/podflow-studio/episodes.json', { signal, cache: 'no-cache' })
  if (!response.ok) throw new Error(`节目清单读取失败（${response.status}）`)
  const payload: unknown = await response.json()
  if (!Array.isArray(payload)) throw new Error('节目清单格式错误')
  return payload as PodFlowEpisode[]
}
