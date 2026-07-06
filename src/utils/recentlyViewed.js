const KEY = 'bw_recently_viewed'
const MAX = 4

export function saveRecentlyViewed(product) {
  try {
    const prev = getRecentlyViewed()
    const next = [product, ...prev.filter(p => p.id !== product.id)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
