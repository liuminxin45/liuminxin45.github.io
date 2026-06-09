import { Link } from 'react-router'
import { photos } from '@/data/photos.generated'

const previewPhotos = photos.slice(0, 5)

export default function PhotoSection() {
  if (photos.length === 0) {
    return null
  }

  return (
    <section id="photography" className="section-block photo-section">
      <div className="section-shell">
        <div className="section-heading with-link">
          <div>
            <p className="soft-label">摄影</p>
            <h2>一些拍下来的片刻。</h2>
          </div>
          <Link to="/photography">查看更多</Link>
        </div>

        <div className="photo-grid">
          {previewPhotos.map((photo, index) => (
            <Link className={index === 0 ? 'photo-card is-featured' : 'photo-card'} key={photo.src} to={`/photography/${photo.slug}`}>
              <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.alt} loading="lazy" />
              <span>
                <strong>{photo.title}</strong>
                {photo.place || photo.date ? <small>{[photo.place, photo.date].filter(Boolean).join(' · ')}</small> : null}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
