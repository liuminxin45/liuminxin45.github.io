import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Github,
  Headphones,
  Play,
  Rss,
} from 'lucide-react'
import { loadPodFlowEpisodes, type PodFlowEpisode } from '@/content/podflow-episodes'

type Chapter = { startTime: number; title: string }

const SITE_URL = 'https://www.liuminxin.cn/works/podflow-studio'
const RELEASE_URL = 'https://github.com/liuminxin45/podflow-studio/releases/latest'
const SOURCE_URL = 'https://github.com/liuminxin45/podflow-studio'
const FEED_URL = '/podflow-studio/feed.xml'

function scrollToPlayer() {
  window.history.replaceState(null, '', '#episode-player')
  window.requestAnimationFrame(() => {
    document.getElementById('episode-player')?.scrollIntoView({ block: 'start' })
  })
}

const workflow = [
  {
    index: '01',
    eyebrow: '素材到事实',
    title: '先知道每句话从哪里来',
    body: '把 RSS、网页和手动笔记收进同一处。素材先经过整理与研究，再成为带来源的事实卡片，不直接把网页原文塞进生成器。',
    image: '/images/podflow-studio/discover.webp',
    alt: 'PodFlow Studio 发现与素材整理界面',
  },
  {
    index: '02',
    eyebrow: '事实到成稿',
    title: '稿子是可编辑的，不是一次性答案',
    body: '先定 6 条快讯和 1 条重点解读的结构，再逐段生成。来源外数字、内部编辑指令和未兑现的开场问题会在进入配音前被拦下。',
    image: '/images/podflow-studio/writing.webp',
    alt: 'PodFlow Studio 事实卡片与可编辑成稿界面',
  },
  {
    index: '03',
    eyebrow: '成稿到声音',
    title: 'AI 配音和真人录音可以在同一期共存',
    body: '用多情感音色逐段生成或替换声音，保留发音复核和听感调整。正式成片统一为 48 kHz、160 kbps，并以 -16 LUFS 为响度目标。',
    image: '/images/podflow-studio/produce.webp',
    alt: 'PodFlow Studio 分段声音制作界面',
  },
  {
    index: '04',
    eyebrow: '成片到发布',
    title: '交付的不只是一条 MP3',
    body: '一期节目同时得到章节、文字稿、来源清单、show notes、RSS 和可检查的发布包。公开发布与本地工作流状态保持分离。',
    image: '/images/podflow-studio/publish.webp',
    alt: 'PodFlow Studio 发布包与 RSS 界面',
  },
]

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(new Date(value))
}

function sameSiteAssetUrl(value: string) {
  const url = new URL(value, window.location.origin)
  return ['www.liuminxin.cn', 'liuminxin45.github.io'].includes(url.hostname)
    ? `${url.pathname}${url.search}`
    : url.href
}

function useProductMetadata() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'PodFlow Studio｜把每天的新闻做成一档节目'
    const values = {
      description: 'PodFlow Studio 是本地优先的 AI 新闻播客制作工作台，从可追溯素材、事实卡片和可编辑成稿，到配音、音频成片和 RSS 发布包。',
      'og:title': 'PodFlow Studio｜把每天的新闻做成一档节目',
      'og:description': '从可追溯素材到可发布成片，一条本地优先的新闻播客工作流。',
      'og:url': SITE_URL,
      'og:image': 'https://www.liuminxin.cn/images/podflow-studio/og.svg',
      'twitter:title': 'PodFlow Studio｜把每天的新闻做成一档节目',
      'twitter:description': '从可追溯素材到可发布成片，一条本地优先的新闻播客工作流。',
      'twitter:image': 'https://www.liuminxin.cn/images/podflow-studio/og.svg',
    }
    const previousMeta: Array<{ element: HTMLMetaElement; content: string; created: boolean }> = []
    for (const [name, content] of Object.entries(values)) {
      const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.head.querySelector<HTMLMetaElement>(selector)
      const created = !meta
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name)
        document.head.append(meta)
      }
      previousMeta.push({ element: meta, content: meta.content, created })
      meta.content = content
    }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const canonicalCreated = !canonical
    const previousCanonical = canonical?.href || ''
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = SITE_URL
    return () => {
      document.title = previousTitle
      for (const entry of previousMeta) {
        if (entry.created) entry.element.remove()
        else entry.element.content = entry.content
      }
      if (canonicalCreated) canonical.remove()
      else canonical.href = previousCanonical
    }
  }, [])
}

export default function PodFlowStudioPage() {
  useProductMetadata()
  const [episodes, setEpisodes] = useState<PodFlowEpisode[]>([])
  const [episodesStatus, setEpisodesStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [episodesError, setEpisodesError] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [chaptersStatus, setChaptersStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const audioRef = useRef<HTMLAudioElement>(null)

  const selected = useMemo(
    () => episodes.find(episode => episode.id === selectedId) || episodes[0],
    [episodes, selectedId],
  )

  useEffect(() => {
    const controller = new AbortController()
    loadPodFlowEpisodes(controller.signal)
      .then(data => {
        setEpisodes(data)
        setSelectedId(data[0]?.id || '')
        setEpisodesStatus('ready')
      })
      .catch(error => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setEpisodesStatus('error')
          setEpisodesError(error instanceof Error ? error.message : '节目清单读取失败')
        }
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (window.location.hash !== '#episode-player' || !selected) return
    scrollToPlayer()
  }, [selected])

  useEffect(() => {
    if (!selected) return
    const controller = new AbortController()
    fetch(sameSiteAssetUrl(selected.chaptersUrl), { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('章节读取失败')))
      .then(data => {
        setChapters(Array.isArray(data.chapters) ? data.chapters : [])
        setChaptersStatus('ready')
      })
      .catch(error => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setChapters([])
          setChaptersStatus('error')
        }
      })
    return () => controller.abort()
  }, [selected])

  const jumpTo = (seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = seconds
    void audioRef.current.play()
  }
  const [audioError, setAudioError] = useState('')

  return (
    <main className="podflow-page">
      <div className="section-shell">
        <Link className="back-link podflow-back" to="/works" viewTransition>
          <ArrowLeft size={16} aria-hidden="true" /> 返回造物间
        </Link>

        <section className="podflow-hero" aria-labelledby="podflow-title">
          <div className="podflow-hero-copy" data-reveal>
            <p className="soft-label">LOCAL-FIRST PODCAST WORKSPACE</p>
            <h1 id="podflow-title">把每天的新闻，做成一档能长期更新的节目。</h1>
            <p className="podflow-lead">PodFlow Studio 把素材发现、事实核验、成稿、声音制作和发布包放进同一个桌面工作台。关键节点留给人判断，重复步骤交给流程。</p>
            <div className="podflow-actions">
              <a
                className="podflow-button podflow-button-primary"
                href="#episode-player"
                onClick={event => {
                  event.preventDefault()
                  scrollToPlayer()
                }}
              >
                {episodesStatus === 'ready' && episodes.length
                  ? <><Play size={17} fill="currentColor" aria-hidden="true" /> 试听最新一期</>
                  : <><Headphones size={17} aria-hidden="true" /> 查看节目状态</>}
              </a>
              <a className="podflow-button podflow-button-secondary" href={RELEASE_URL} target="_blank" rel="noreferrer">
                <Download size={17} aria-hidden="true" /> 下载 Windows
              </a>
            </div>
            <a className="podflow-source-link" href={SOURCE_URL} target="_blank" rel="noreferrer">
              <Github size={15} aria-hidden="true" /> 查看 LGPL-3.0 源码 <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
          <figure className="podflow-hero-media" data-reveal data-reveal-delay="1">
            <img src="/images/podflow-studio/discover.webp" alt="PodFlow Studio 真实桌面应用中的新闻发现工作区" width="1600" height="1000" />
            <figcaption>素材发现工作区。所有产品画面均来自实际桌面应用。</figcaption>
          </figure>
        </section>

        <section className="podflow-proof" aria-label="默认节目规格" data-reveal="group">
          <div><strong>12 至 15 分钟</strong><span>适合通勤的一期长度</span></div>
          <div><strong>6 + 1</strong><span>六条快讯，一条重点解读</span></div>
          <div><strong>本地优先</strong><span>稿件、录音和工作流留在本机</span></div>
        </section>

        <section className="podflow-workflow" aria-labelledby="workflow-title">
          <header className="podflow-section-heading" data-reveal>
            <p className="soft-label">FROM SOURCE TO RELEASE</p>
            <h2 id="workflow-title">不是生成一段声音，是完成一期节目。</h2>
            <p>每一步都有明确输入、可检查产物和失败原因。需要调整时，可以回到那一步，而不是推倒重来。</p>
          </header>
          {workflow.map((item, index) => (
            <article className={`podflow-workflow-row ${index % 2 ? 'is-reversed' : ''}`} key={item.index} data-reveal>
              <div className="podflow-workflow-copy">
                <span className="podflow-step">{item.index}</span>
                <p className="soft-label">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <img src={item.image} alt={item.alt} width="1600" height="1000" loading="lazy" />
            </article>
          ))}
        </section>

        <section className="podflow-episodes" id="episodes" aria-labelledby="episodes-title">
          <header className="podflow-section-heading" data-reveal>
            <p className="soft-label">PODFLOW 晨报</p>
            <h2 id="episodes-title">先听成片，再决定要不要用工具。</h2>
            <p>节目只发布经过事实、成稿、发音和听感终审的版本。mock 音频不会出现在这里。</p>
          </header>

          {episodesStatus === 'loading' && <div className="podflow-content-state" role="status">正在读取已终审节目...</div>}
          {episodesStatus === 'error' && <div className="podflow-content-state is-error" role="alert"><h3>节目暂时无法读取</h3><p>{episodesError}。页面不会跳转到外站，请稍后在这里重试。</p></div>}
          {episodesStatus === 'ready' && episodes.length === 0 && (
            <div className="podflow-content-state is-empty" data-reveal>
              <Headphones size={28} aria-hidden="true" />
              <h3>真实样片正在完成终审</h3>
              <p>这里不会放 10 秒 mock 音频，也不会用占位节目凑数。首批 10 期完成后，播放器、章节、来源和文字稿会一起出现。</p>
            </div>
          )}

          {selected && (
            <div className="podflow-player" id="episode-player" data-reveal>
              <div className="podflow-player-main">
                <img src={selected.coverUrl} alt={`${selected.title} 封面`} width="560" height="560" />
                <div>
                  <p className="soft-label">最新一期 · {formatDate(selected.publishedAt)}</p>
                  <h3>{selected.title}</h3>
                  <p>{selected.summary}</p>
                  <audio ref={audioRef} controls preload="metadata" src={sameSiteAssetUrl(selected.audioUrl)} onError={() => setAudioError('音频暂时无法加载，请稍后重试。页面不会跳转到外部播放器。')}>你的浏览器不支持音频播放。</audio>
                  {audioError && <p className="podflow-audio-error" role="alert">{audioError}</p>}
                  <div className="podflow-episode-links">
                    <a href={sameSiteAssetUrl(selected.transcriptUrl)}><FileText size={15} aria-hidden="true" /> 文字稿</a>
                    <a href={FEED_URL}><Rss size={15} aria-hidden="true" /> RSS</a>
                  </div>
                </div>
              </div>
              <div className="podflow-player-detail">
                <div>
                  <h4>章节</h4>
                  <ol className="podflow-chapters">
                    {chaptersStatus === 'loading' && <li className="podflow-chapter-state" role="status">正在读取章节...</li>}
                    {chaptersStatus === 'error' && <li className="podflow-chapter-state" role="alert">章节暂时无法读取，仍可使用播放器拖动进度。</li>}
                    {chapters.map(chapter => (
                      <li key={`${chapter.startTime}-${chapter.title}`}>
                        <button type="button" onClick={() => jumpTo(chapter.startTime)}>
                          <span>{formatDuration(chapter.startTime)}</span>{chapter.title}
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4>来源</h4>
                  <ul className="podflow-sources">
                    {selected.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={12} aria-hidden="true" /></a></li>)}
                  </ul>
                  <p className="podflow-disclosure">AI 辅助整理与初稿。配音服务：{selected.ttsProvider}。事实、成稿、发音和听感由人工终审。</p>
                  {selected.musicCredits.map(credit => <p className="podflow-disclosure" key={`${credit.artist}-${credit.title}`}>音乐：<a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.title}</a>，{credit.artist}，<a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>。{credit.edited}</p>)}
                </div>
              </div>
            </div>
          )}

          {episodes.length > 1 && (
            <div className="podflow-episode-index" aria-label="往期节目">
              {episodes.map(episode => (
                <button type="button" key={episode.id} className={episode.id === selected?.id ? 'is-active' : ''} onClick={() => {
                  setSelectedId(episode.id)
                  setChapters([])
                  setChaptersStatus('loading')
                  setAudioError('')
                }}>
                  <span>{formatDate(episode.publishedAt)}</span>
                  <strong>{episode.title}</strong>
                  <span><Clock3 size={13} aria-hidden="true" /> {formatDuration(episode.durationSeconds)}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="podflow-local" data-reveal>
          <div>
            <p className="soft-label">LOCAL BY DEFAULT</p>
            <h2>你的素材、稿件和录音，不必先上传到另一个平台。</h2>
          </div>
          <div>
            <p>工作流状态和中间产物保存在本机。外部 LLM、搜索和语音服务按需配置，真人录音可以替换任意 TTS 片段。</p>
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">查看实现与许可证 <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="podflow-final-cta" data-reveal>
          <p className="soft-label">PODFLOW STUDIO 0.2.0</p>
          <h2>从下一期开始，把制作过程变成可以重复的系统。</h2>
          <div className="podflow-actions">
            <a className="podflow-button podflow-button-primary" href={RELEASE_URL} target="_blank" rel="noreferrer"><Download size={17} aria-hidden="true" /> 下载 Windows</a>
            <a className="podflow-button podflow-button-secondary" href={SOURCE_URL} target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" /> GitHub 源码</a>
          </div>
        </section>
      </div>
    </main>
  )
}
