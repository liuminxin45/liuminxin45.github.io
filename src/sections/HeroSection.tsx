import { Link } from 'react-router'
import PhotoTransitionLink from '@/components/PhotoTransitionLink'
import { records } from '@/data/records.generated'
import { photos } from '@/data/photos.generated'

export default function HeroSection() {
  const latestRecord = records[0]
  const latestPhoto = photos[0]

  return (
    <section className="hero-section">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <h1>嗨! 朋友</h1>

          <div className="hero-index" aria-label="最新内容">
            {latestRecord ? (
              <Link className="hero-index-row" to={`/blogs/${latestRecord.slug}`} viewTransition>
                <span>博客</span>
                <strong>{latestRecord.title}</strong>
                {latestRecord.date ? <time>{latestRecord.date}</time> : null}
              </Link>
            ) : null}

            {latestPhoto ? (
              <Link className="hero-index-row" to={`/photography/${latestPhoto.slug}`} viewTransition>
                <span>摄影</span>
                <strong>{latestPhoto.title}</strong>
                {latestPhoto.date ? <time>{latestPhoto.date}</time> : null}
              </Link>
            ) : null}
          </div>
        </div>

        {latestPhoto ? (
          <PhotoTransitionLink
            className="hero-photo"
            slug={latestPhoto.slug}
            src={`${import.meta.env.BASE_URL}${latestPhoto.src}`}
            alt={latestPhoto.alt}
            loading="eager"
            aria-label={latestPhoto.title}
          />
        ) : null}
      </div>
    </section>
  )
}
