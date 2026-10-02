import { readFile, rename, writeFile } from 'node:fs/promises'
import { XMLParser } from 'fast-xml-parser'
import { parse } from 'node-html-parser'

const feedUrl = 'https://medium.com/feed/@jeffryjolly'
const outputPath = new URL('../src/data/posts.json', import.meta.url)
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

function toSecureUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

function getCategories(value) {
  if (!value) return []
  const categories = Array.isArray(value) ? value : [value]
  return categories
    .map((category) => String(category).trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((category) => category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' '))
}

function mapPost(item) {
  const url = toSecureUrl(item.link)
  const html = parse(item.description || item['content:encoded'] || '')
  const articleText = html.structuredText.replace(/\s+/g, ' ').trim()
  if (!url || !item.title || !articleText) return null

  const publishedAt = new Date(item.pubDate)
  if (Number.isNaN(publishedAt.getTime())) return null

  const guid = item.guid?.['#text'] || item.guid
  const words = articleText.split(/\s+/).length
  const excerpt = articleText.length > 180
    ? `${articleText.slice(0, 177).trimEnd()}...`
    : articleText

  return {
    id: String(guid || url),
    title: String(item.title).trim(),
    excerpt,
    date: publishedAt.toISOString().slice(0, 10),
    readTime: `${Math.max(1, Math.ceil(words / 220))} min read`,
    tags: getCategories(item.category),
    cover: toSecureUrl(html.querySelector('img[src]')?.getAttribute('src') || ''),
    url,
  }
}

try {
  const response = await fetch(feedUrl, {
    headers: { accept: 'application/rss+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`Medium RSS returned HTTP ${response.status}`)

  const feed = parser.parse(await response.text())
  const rawItems = feed?.rss?.channel?.item
  const items = (Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [])
    .map(mapPost)
    .filter(Boolean)

  if (items.length === 0) throw new Error('Medium RSS contained no usable articles')

  const temporaryPath = new URL('../src/data/posts.json.tmp', import.meta.url)
  await writeFile(temporaryPath, `${JSON.stringify(items, null, 2)}\n`)
  await rename(temporaryPath, outputPath)
  console.log(`Synced ${items.length} Medium article${items.length === 1 ? '' : 's'}.`)
} catch (error) {
  await readFile(outputPath)
  console.warn(`Medium RSS sync skipped; keeping existing posts.json. ${error.message}`)
}
