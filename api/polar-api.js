// Vercel 서버리스 함수 — Polar API 프록시
// vite.config.js의 dev 서버 프록시와 동일한 역할: 액세스 토큰을 서버 측에서 주입
// 파일명에 대괄호를 쓰는 캐치올([...path].js) 방식은 Windows에서 @vercel/nft가
// EISDIR 오류를 내며 빌드에 실패하므로, 쿼리 파라미터로 나머지 경로를 전달받는다.
export default async function handler(req, res) {
  const isProd = process.env.VITE_POLAR_SERVER === 'production'
  const base = isProd ? 'https://api.polar.sh' : 'https://sandbox-api.polar.sh'

  const { rest, ...query } = req.query
  const search = new URLSearchParams(query).toString()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
  }

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'

  const upstream = await fetch(`${base}/${rest || ''}${search ? `?${search}` : ''}`, {
    method: req.method,
    headers,
    body: hasBody ? JSON.stringify(req.body) : undefined,
  })

  const text = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
  res.send(text)
}
