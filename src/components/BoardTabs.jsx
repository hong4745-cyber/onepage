import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { label: '공지사항', path: '/notice' },
  { label: '상품문의', path: '/qna' },
  { label: '리뷰',     path: '/reviews' },
  { label: '이벤트',   path: '/events' },
]

// 게시판 공통 탭 — 평소엔 흰 배경, 스크롤 시 밝은 유리 반투명(오버레이 없음)
export default function BoardTabs() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      display: 'flex',
      background: scrolled ? 'rgba(255,255,255,0.5)' : '#fff',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: '1px solid var(--c-line)',
      transition: 'background 0.25s ease',
    }}>
      {TABS.map(tab => {
        const active = pathname === tab.path
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, padding: '11px 10px',
              background: 'none', border: 'none',
              borderBottom: active ? '2px solid var(--c-primary)' : '2px solid transparent',
              marginBottom: '-1px',
              fontSize: 'var(--text-sm)',
              fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-medium)',
              color: active ? 'var(--c-primary)' : 'rgba(4,9,34,0.55)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
