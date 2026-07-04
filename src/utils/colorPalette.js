// 상품 색상명 → hex 코드 단일 관리 (products.json 마이그레이션 시 이 팔레트로 hex를 채웠음)
export const COLOR_PALETTE = {
  '블랙':            '#1a1a1a',
  '글로스 블랙':      '#101010',
  '화이트':          '#f0efeb',
  '그레이':          '#9a9a9a',
  '클라우드 그레이':   '#cfd2d4',
  '갤버나이즈드 그레이': '#8a8a8a',
  '실버':            '#c0c0c0',
  '네이비':          '#1e2a4a',
  '미드나잇 블루 메탈릭': '#22314f',
  '블루':            '#2a4a7a',
  '탄(브라운)':       '#8a6a4a',
  '모카':            '#6b4f3a',
  '골드':            '#c9a86a',
  '소프트 골드':      '#c9a86a',
  '골드 베이지':      '#d8c9a8',
  '베이지':          '#d8c9a8',
  '더스티 핑크':      '#c8a2a8',
  '버건디':          '#7a2e3e',
  '파파야 오렌지':     '#e87722',
}

export function isLightColor(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) > 180
}
