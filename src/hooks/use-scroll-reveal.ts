import { useEffect } from 'react'

import { prefersReducedMotion } from '@/lib/view-transitions'

export default function useScrollReveal(routeKey: string) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -8% 0px',
        // Reveal as soon as any part enters the viewport. A ratio-based
        // threshold can never be reached by very tall elements, such as a
        // full blog article whose height is many times the viewport height.
        threshold: 0,
      },
    )

    elements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [routeKey])
}
