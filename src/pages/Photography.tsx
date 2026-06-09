import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { photos } from '@/data/photos.generated'

export default function PhotographyPage() {
  return (
    <main className="photography-page">
      <div className="section-shell">
        <Link className="back-link" to="/">
          <ArrowLeft size={17} />
          回到首页
        </Link>

        <section className="work-hero">
          <p className="soft-label">摄影</p>
          <h1>一些拍下来的片刻。</h1>
          <p>按时间从新到旧整理。每张照片都有自己的页面，可以放照片背后的文字。</p>
        </section>

        {photos.length > 0 ? (
          <section className="photo-index">
            {photos.map(photo => (
              <Link className="photo-index-row" key={photo.src} to={`/photography/${photo.slug}`}>
                <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.alt} loading="lazy" />
                <div>
                  <h2>{photo.title}</h2>
                  {photo.excerpt ? <p>{photo.excerpt}</p> : null}
                </div>
                <span>{[photo.place, photo.date].filter(Boolean).join(' · ')}</span>
              </Link>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  )
}
