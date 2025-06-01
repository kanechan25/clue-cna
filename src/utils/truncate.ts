export const MAX_PREVIEW_LENGTH = 250

// Optimized HTML truncation with memoization and improved DOM handling
const createTruncationCache = () => {
  const cache = new Map()
  const MAX_CACHE_SIZE = 100

  return {
    get: (key: string) => cache.get(key),
    set: (key: string, value: string) => {
      if (cache.size >= MAX_CACHE_SIZE) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      cache.set(key, value)
    },
    clear: () => cache.clear(),
  }
}

const truncationCache = createTruncationCache()

// Optimized truncation function with caching and performance improvements
export const truncateHtmlContent = (html: string, maxLength: number = MAX_PREVIEW_LENGTH): string => {
  const cacheKey = `${html.substring(0, 50)}-${maxLength}`
  const cached = truncationCache.get(cacheKey)
  if (cached) return cached

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment()
  const tempDiv = document.createElement('div')
  fragment.appendChild(tempDiv)
  tempDiv.innerHTML = html

  const textContent = tempDiv.textContent || tempDiv.innerText || ''

  let result: string
  if (textContent.length <= maxLength) {
    result = html
  } else {
    const truncatedText = textContent.slice(0, maxLength)
    const lastSpaceIndex = truncatedText.lastIndexOf(' ')
    const finalLength = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength
    result = textContent.slice(0, finalLength) + '...'
  }

  truncationCache.set(cacheKey, result)
  return result
}
