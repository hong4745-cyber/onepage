import { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { label: '홈',          path: '/',           search: ''                      },
  { label: '신제품',      path: '/products',   search: 'filter=new'            },
  { label: '맥라렌 에디션', path: '/special',  search: ''                      },
  { label: '헤드폰',      path: '/products',   search: 'category=헤드폰'       },
  { label: '이어버드',    path: '/products',   search: 'category=이어버드'     },
  { label: '무선스피커',  path: '/products',   search: 'category=무선스피커'   },
  { label: '스피커',      path: '/products',   search: 'category=라우드스피커' },
  { label: '액세서리',    path: '/products',   search: 'category=액세서리'     },
  { label: '프로모션',    path: '/promotions', search: ''                      },
]

export default function ProductCategoryBar() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const scrollRef = useRef(null)
  const dragRef = useRef({ dragging: false, startX: 0, scrollLeft: 0, moved: false })

  function isActive(tab) {
    if (pathname !== tab.path) return false
    if (!tab.search) return pathname === tab.path
    const [key, value] = tab.search.split('=')
    return new URLSearchParams(search).get(key) === value
  }

  function onMouseDown(e) {
    const el = scrollRef.current
    dragRef.current = { dragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false }
    el.style.cursor = 'grabbing'
  }
  function onMouseMove(e) {
    const d = dragRef.current
    if (!d.dragging) return
    e.preventDefault()
    const el = scrollRef.current
    const dx = e.pageX - el.offsetLeft - d.startX
    if (Math.abs(dx) > 4) d.moved = true
    el.scrollLeft = d.scrollLeft - dx
  }
  function onMouseUp() {
    dragRef.current.dragging = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
        borderBottom: '1px solid #f0f0f0', background: '#fff',
        position: 'sticky', top: 0, zIndex: 100, cursor: 'grab',
      }}
    >
      <div style={{ display: 'flex', width: 'max-content', padding: '0 16px' }}>
        {TABS.map(tab => {
          const active = isActive(tab)
          return (
            <button
              key={tab.label}
              onClick={() => { if (!dragRef.current.moved) navigate(`${tab.path}${tab.search ? '?' + tab.search : ''}`) }}
              style={{
                padding: '12px 14px',
                fontSize: '13px',
                fontWeight: active ? '700' : '400',
                color: active ? '#111' : '#999',
                background: 'none',
                border: 'none',
                borderBottom: active ? '2px solid #111' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
