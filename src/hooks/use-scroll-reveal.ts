import { useEffect } from 'react'

import { prefersReducedMotion } from '@/lib/view-transitions'

export default function useScrollReveal(routeKey: string) {
  useEffect(() => {
    const selector = '[data-reveal]'
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))

    const revealElement = (element: HTMLElement) => element.classList.add('is-revealed')

    const revealAddedElements = (node: Node) => {
      if (!(node instanceof HTMLElement)) return
      if (node.matches(selector)) revealElement(node)
      node.querySelectorAll<HTMLElement>(selector).forEach(revealElement)
    }

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      elements.forEach(revealElement)
      const mutationObserver = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(revealAddedElements))
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
      return () => mutationObserver.disconnect()
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

    const observed = new WeakSet<HTMLElement>()
    const observeElement = (element: HTMLElement) => {
      if (observed.has(element) || element.classList.contains('is-revealed')) return
      observed.add(element)
      observer.observe(element)
    }
    const observeAddedElements = (node: Node) => {
      if (!(node instanceof HTMLElement)) return
      if (node.matches(selector)) observeElement(node)
      node.querySelectorAll<HTMLElement>(selector).forEach(observeElement)
    }

    elements.forEach(observeElement)
    const mutationObserver = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(observeAddedElements))
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [routeKey])
}
