type AnalyticsConfig = {
  plausibleDomain?: string
  umamiScriptUrl?: string
  umamiWebsiteId?: string
}

function appendScript(id: string, src: string, attrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return

  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.defer = true
  script.src = src

  Object.entries(attrs).forEach(([key, value]) => {
    script.setAttribute(key, value)
  })

  document.head.appendChild(script)
}

export function initAnalytics() {
  const config: AnalyticsConfig = {
    plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
    umamiScriptUrl: import.meta.env.VITE_UMAMI_SCRIPT_URL,
    umamiWebsiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID,
  }

  if (config.umamiScriptUrl && config.umamiWebsiteId) {
    appendScript('umami-analytics', config.umamiScriptUrl, {
      'data-website-id': config.umamiWebsiteId,
    })
  }

  if (config.plausibleDomain) {
    appendScript('plausible-analytics', 'https://plausible.io/js/script.js', {
      'data-domain': config.plausibleDomain,
    })
  }
}
