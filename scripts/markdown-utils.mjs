import path from 'node:path'

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function parseFrontmatter(markdown) {
  const content = String(markdown).replace(/^\uFEFF/, '')
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) {
    return { data: {}, body: content.replace(/\r\n?/g, '\n') }
  }

  const data = {}
  const raw = match[1].trim()
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (match) {
      data[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim()
    }
  }

  return { data, body: content.slice(match[0].length).replace(/\r\n?/g, '\n').trim() }
}

export function slugFromFile(file) {
  return path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function dateFromFile(file) {
  const match = file.match(/(\d{4})[-_.](\d{2})[-_.](\d{2})/)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : ''
}

export function sortKey(date, file) {
  if (date) {
    return date.replaceAll('.', '-')
  }

  return dateFromFile(file) || '0000-00-00'
}

export function excerptFromMarkdown(markdown) {
  return String(markdown)
    .replace(/\r\n?/g, '\n')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[[^\]]+]\([^)]+\)/g, match => match.replace(/^\[([^\]]+)].*$/, '$1'))
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`>#|-]/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ')
    .slice(0, 140)
}

function resolveAssetUrl(url, assetBase) {
  if (!assetBase || /^(https?:)?\/\//.test(url) || url.startsWith('/') || url.startsWith('#')) {
    return url
  }

  return `/${assetBase.replace(/^\/|\/?$/g, '')}/${url.replace(/^\.\//, '')}`
}

export function inlineMarkdown(value, assetBase = '') {
  const placeholders = []
  const stash = html => {
    const key = `\u0000${placeholders.length}\u0000`
    placeholders.push(html)
    return key
  }

  let text = String(value)
    .replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escapeHtml(code)}</code>`))
    .replace(/\[([^\]]+)]\(([^)\s]+)\)/g, (_, label, url) => {
      const safeLabel = escapeHtml(label)
      const safeUrl = escapeHtml(resolveAssetUrl(url, assetBase))
      const target = /^https?:\/\//.test(url) ? ' target="_blank" rel="noreferrer"' : ''
      return stash(`<a href="${safeUrl}"${target}>${safeLabel}</a>`)
    })

  text = escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return text.replace(/\u0000(\d+)\u0000/g, (_, index) => placeholders[Number(index)] ?? '')
}

function renderTable(block, assetBase) {
  const lines = block.split('\n').map(line => line.trim()).filter(Boolean)
  if (lines.length < 2 || !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[1])) {
    return null
  }

  const split = line => line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
  const headers = split(lines[0])
  const rows = lines.slice(2).map(split)

  return `<div class="markdown-table-wrap"><table><thead><tr>${headers
    .map(header => `<th>${inlineMarkdown(header, assetBase)}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map(row => `<tr>${row.map(cell => `<td>${inlineMarkdown(cell, assetBase)}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`
}

function renderList(block, assetBase) {
  const lines = block.split('\n').map(line => line.trim()).filter(Boolean)
  if (lines.every(line => /^[-*]\s+/.test(line))) {
    return `<ul>${lines.map(line => `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ''), assetBase)}</li>`).join('')}</ul>`
  }

  if (lines.every(line => /^\d+\.\s+/.test(line))) {
    return `<ol>${lines.map(line => `<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ''), assetBase)}</li>`).join('')}</ol>`
  }

  return null
}

export function markdownToHtml(markdown, options = {}) {
  const assetBase = options.assetBase ?? ''
  const normalized = String(markdown).replace(/\r\n?/g, '\n')
  const blocks = normalized.split(/\n{2,}/).map(block => block.trim()).filter(Boolean)
  const html = []

  for (const block of blocks) {
    if (block.startsWith('```')) {
      const lines = block.split('\n')
      const language = lines[0].replace(/^```/, '').trim()
      const code = lines.slice(1, lines.at(-1)?.trim() === '```' ? -1 : undefined).join('\n')
      html.push(`<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(code)}</code></pre>`)
      continue
    }

    const table = renderTable(block, assetBase)
    if (table) {
      html.push(table)
      continue
    }

    const list = renderList(block, assetBase)
    if (list) {
      html.push(list)
      continue
    }

    const image = block.match(/^!\[([^\]]*)]\(([^)\s]+)\)$/)
    if (image) {
      html.push(`<figure><img src="${escapeHtml(resolveAssetUrl(image[2], assetBase))}" alt="${escapeHtml(image[1])}" loading="lazy" /></figure>`)
      continue
    }

    if (/^-{3,}$/.test(block)) {
      html.push('<hr />')
      continue
    }

    if (block.startsWith('### ')) {
      html.push(`<h3>${inlineMarkdown(block.slice(4), assetBase)}</h3>`)
      continue
    }
    if (block.startsWith('## ')) {
      html.push(`<h2>${inlineMarkdown(block.slice(3), assetBase)}</h2>`)
      continue
    }
    if (block.startsWith('# ')) {
      html.push(`<h1>${inlineMarkdown(block.slice(2), assetBase)}</h1>`)
      continue
    }
    if (block.startsWith('> ')) {
      html.push(`<blockquote>${inlineMarkdown(block.replace(/^>\s?/gm, ' '), assetBase)}</blockquote>`)
      continue
    }

    html.push(`<p>${inlineMarkdown(block, assetBase).replace(/\n/g, '<br />')}</p>`)
  }

  return html.join('\n')
}
