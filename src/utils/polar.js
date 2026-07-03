// Polar(polar.sh) 결제 연동 유틸리티
// 모든 요청은 Vite 프록시(/polar-api)를 경유 — 액세스 토큰은 서버 측에서 주입됨

// Polar 대시보드의 상품명 접두사 "(Bowers & Wilkins)"를 제거하고 로컬 상품명과 매칭
const NAME_PREFIX = /^\(Bowers\s*&\s*Wilkins\)\s*/

let productsCache = null

/** Polar에 등록된 상품 목록을 실시간 조회 (세션 내 캐시) */
export async function fetchPolarProducts() {
  if (productsCache) return productsCache
  // 주의: 트레일링 슬래시 필수 — 없으면 307 리다이렉트되며 인증 헤더가 빠짐
  const res = await fetch('/polar-api/v1/products/?is_archived=false&limit=100')
  if (!res.ok) throw new Error(`Polar 상품 목록 조회 실패 (${res.status})`)
  const data = await res.json()
  productsCache = data.items.map(p => ({
    id: p.id,
    name: p.name.replace(NAME_PREFIX, '').trim(),
    rawName: p.name,
  }))
  return productsCache
}

/** 로컬 상품명으로 Polar 상품을 찾음 (없으면 null) */
export async function findPolarProduct(localName) {
  const items = await fetchPolarProducts()
  return items.find(p => p.name === localName.trim()) ?? null
}

/** 체크아웃 세션 생성 → Polar 결제 페이지 URL 반환 */
export async function createCheckout(productIds, metadata = {}) {
  const successUrl = import.meta.env.VITE_POLAR_SUCCESS_URL || `${window.location.origin}/success`
  const res = await fetch('/polar-api/v1/checkouts/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      products: productIds,
      success_url: `${successUrl}?checkout_id={CHECKOUT_ID}`,
      metadata,
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Polar 체크아웃 생성 실패 (${res.status}) ${body}`)
  }
  return res.json() // { id, url, ... }
}

/** 체크아웃 상태 조회 (결제 성공 페이지에서 사용) */
export async function getCheckout(checkoutId) {
  const res = await fetch(`/polar-api/v1/checkouts/${checkoutId}`)
  if (!res.ok) throw new Error(`Polar 체크아웃 조회 실패 (${res.status})`)
  return res.json()
}
