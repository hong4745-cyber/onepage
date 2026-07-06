const CHOSUNG  = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
const JUNGSUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
const JONGSUNG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

// 영문 키보드 → 한글 자모 (QWERTY 기준)
const EN_TO_KO = {
  q:'ㅂ', w:'ㅈ', e:'ㄷ', r:'ㄱ', t:'ㅅ', y:'ㅛ', u:'ㅕ', i:'ㅑ', o:'ㅐ', p:'ㅔ',
  a:'ㅁ', s:'ㄴ', d:'ㅇ', f:'ㄹ', g:'ㅎ', h:'ㅗ', j:'ㅓ', k:'ㅏ', l:'ㅣ',
  z:'ㅋ', x:'ㅌ', c:'ㅊ', v:'ㅍ', b:'ㅠ', n:'ㅜ', m:'ㅡ',
}

// ㅐ↔ㅔ 처럼 발음이 같거나 헷갈리는 모음 정규화
const NORMALIZE_VOWEL = { 'ㅔ':'ㅐ', 'ㅖ':'ㅒ', 'ㅞ':'ㅙ', 'ㅟ':'ㅢ' }

/** 한글 음절 → 자모 분해 (e.g. "헤드폰" → "ㅎㅔㄷㅡㅍㅗㄴ") */
function decompose(str) {
  return [...str].map(ch => {
    const c = ch.charCodeAt(0)
    if (c >= 0xAC00 && c <= 0xD7A3) {
      const off = c - 0xAC00
      const cho  = CHOSUNG[Math.floor(off / 28 / 21)]
      const jung = JUNGSUNG[Math.floor((off / 28) % 21)]
      const jong = JONGSUNG[off % 28]
      return cho + jung + jong
    }
    return ch
  }).join('')
}

/** 모음 정규화 적용 자모 분해 */
function decomposeNorm(str) {
  return decompose(str).split('').map(c => NORMALIZE_VOWEL[c] ?? c).join('')
}

/** 초성만 추출 (e.g. "헤드폰" → "ㅎㄷㅍ") */
function extractChosung(str) {
  return [...str].map(ch => {
    const c = ch.charCodeAt(0)
    if (c >= 0xAC00 && c <= 0xD7A3) return CHOSUNG[Math.floor((c - 0xAC00) / 28 / 21)]
    if (CHOSUNG.includes(ch)) return ch
    return ''
  }).join('')
}

/** 쿼리가 초성만으로 구성됐는지 */
function isChosungOnly(str) {
  const chars = [...str].filter(c => c !== ' ')
  return chars.length > 0 && chars.every(c => CHOSUNG.includes(c))
}

/** 영문 → 한글 자모 변환 */
function engToKo(str) {
  return [...str].map(c => EN_TO_KO[c.toLowerCase()] ?? c).join('')
}

/**
 * 자모 수준에서 1자 오차 허용 퍼지 검색
 * target 안에 query와 최대 1자 다른 부분 문자열이 있으면 true
 */
function fuzzyJamoIncludes(target, query) {
  const tLen = target.length
  const qLen = query.length
  if (qLen < 3 || tLen < qLen) return false          // 너무 짧으면 오탐 위험
  for (let i = 0; i <= tLen - qLen; i++) {
    let diff = 0
    for (let j = 0; j < qLen; j++) {
      if (target[i + j] !== query[j]) diff++
      if (diff > 1) break
    }
    if (diff <= 1) return true
  }
  return false
}

/**
 * 상품 하나에 대해 매칭 점수 반환 (0 = 불일치, 숫자가 클수록 관련도 높음)
 * SearchOverlay에서 score > 0 인 것만 필터, score 내림차순 정렬
 */
export function searchScore(product, rawQuery) {
  if (!rawQuery) return 0
  const q = rawQuery.trim().toLowerCase()
  if (!q) return 0

  const name     = product.name.toLowerCase()
  const category = product.category.toLowerCase()
  const desc     = (product.description ?? '').toLowerCase()
  const full     = `${name} ${category} ${desc}`

  // ── 1. 직접 포함 ───────────────────────────────────────────
  if (name.includes(q))     return 100
  if (category.includes(q)) return 90
  if (desc.includes(q))     return 70

  // ── 2. 초성 검색 ───────────────────────────────────────────
  if (isChosungOnly(q)) {
    const cho = extractChosung(full)
    if (cho.includes(q)) return 85
  }

  // ── 3. 자모 분해 비교 ──────────────────────────────────────
  const qJamo      = decomposeNorm(q)
  const nameJamo   = decomposeNorm(name)
  const fullJamo   = decomposeNorm(full)
  if (nameJamo.includes(qJamo)) return 80
  if (fullJamo.includes(qJamo)) return 65

  // ── 4. 영문 → 한글 변환 후 비교 ────────────────────────────
  const koQ = engToKo(q)
  if (koQ !== q) {
    if (name.includes(koQ) || category.includes(koQ)) return 75
    const koQJamo = decomposeNorm(koQ)
    if (nameJamo.includes(koQJamo)) return 72
    if (isChosungOnly(koQ) && extractChosung(full).includes(koQ)) return 70
  }

  // ── 5. 퍼지 (자모 1자 오차) ────────────────────────────────
  if (fuzzyJamoIncludes(nameJamo, qJamo)) return 50
  if (koQ !== q && fuzzyJamoIncludes(nameJamo, decomposeNorm(koQ))) return 45

  return 0
}
