const SAVE_DEBOUNCE_DELAY = 800

// Debounced save function to prevent localStorage writes continously
let saveTimeoutId: NodeJS.Timeout | null = null

export const debouncedSave = (saveFn: () => void) => {
  if (saveTimeoutId) {
    clearTimeout(saveTimeoutId)
  }
  saveTimeoutId = setTimeout(saveFn, SAVE_DEBOUNCE_DELAY)
}

const selectorsCache = new Map()

export const createMemoizedSelector = <T>(selector: (state: any) => T, cacheKey: string) => {
  return (state: any) => {
    const cacheValue = selectorsCache.get(cacheKey)
    if (cacheValue && cacheValue.state === state) {
      return cacheValue.result
    }
    const result = selector(state)
    selectorsCache.set(cacheKey, { state, result })
    return result
  }
}

export const clearSelectorsCache = () => {
  selectorsCache.clear()
}

export const getSelectorsCacheSize = () => {
  return selectorsCache.size
}
