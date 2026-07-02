import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import logoImg from '../assets/images/0_logo.png'
import iconCart from '../assets/images/icon_cart.png'
import iconSearch from '../assets/images/icon_search.png'
import { useMenu } from '../context/MenuContext'
import { useSearch } from '../context/SearchContext'
import { useCart } from '../context/CartContext'

const TABS = [
  { label: '홈',            path: '/',          search: ''                      },
  { label: '신제품',        path: '/products',  search: 'filter=new'            },
  { label: '맥라렌 에디션', path: '/special',   search: ''                      },
  { label: '헤드폰',        path: '/products',  search: 'category=헤드폰'       },
  { label: '이어버드',      path: '/products',  search: 'category=이어버드'     },
  { label: '무선 스피커',   path: '/products',  search: 'category=무선스피커'   },
  { label: '스피커',        path: '/products',  search: 'category=라우드스피커' },
  { label: '액세서리',      path: '/products',  search: 'category=액세서리'     },
  { label: '프로모션',      path: '/promotions', search: ''                     },
]

function isTabActive(tab, pathname, search) {
  if (pathname !== tab.path) return false
  if (!tab.search) return true
  const [key, value] = tab.search.split('=')
  return new URLSearchParams(search).get(key) === value
}

function CatTabs() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const scrollRef = useRef(null)
  const dragRef = useRef({ dragging: false, startX: 0, scrollLeft: 0, moved: false })

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

  function handleClick(tab) {
    if (dragRef.current.moved) return
    navigate(`${tab.path}${tab.search ? '?' + tab.search : ''}`)
  }

  return (
    <div
      ref={scrollRef}
      className="header-cat-tabs"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {TABS.map(tab => {
        const active = isTabActive(tab, pathname, search)
        return (
          <button
            key={tab.label}
            className={`header-cat-btn${active ? ' active' : ''}`}
            onClick={() => handleClick(tab)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Header({ showBack = false, title }) {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { setOverlayOpen } = useMenu()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { setSearchOpen } = useSearch()
  const { totalCount } = useCart()
  const transparent = isHome && !scrolled
  const iconColor = transparent ? '#fff' : '#111'

  if (isHome && scrolled) {
    return (
      <div className="header-sticky-wrap glass">
        <CatTabs />
      </div>
    )
  }

  return (
    <div className={`header-sticky-wrap${transparent ? ' transparent' : ''}`}>
      <div className="main-header">
        <div className="header-left">
          {showBack ? (
            <button className="icon-btn" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: iconColor, fontSize: '18px' }} />
            </button>
          ) : (
            <button className="icon-btn" onClick={() => setOverlayOpen(o => !o)}>
              <FontAwesomeIcon icon={faBars} style={{ color: iconColor, fontSize: '18px' }} />
            </button>
          )}
        </div>

        <div className="logo-wrap" onClick={() => navigate('/')}>
          {title ? (
            <span style={{ fontSize: '15px', fontWeight: '600', color: iconColor, letterSpacing: '0.3px' }}>{title}</span>
          ) : (
            <img src={logoImg} alt="Bowers & Wilkins"
              style={transparent ? { filter: 'brightness(0) invert(1)' } : {}} />
          )}
        </div>

        <div className="header-right">
          <button className="icon-btn" onClick={() => setSearchOpen(true)}>
            <img src={iconSearch} alt="검색" style={{ width: '28px', height: '32px', objectFit: 'contain', filter: transparent ? 'brightness(0) invert(1)' : 'none' }} />
          </button>
          <button className="icon-btn" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
            <img src={iconCart} alt="장바구니" style={{ width: '28px', height: '32px', objectFit: 'contain', filter: transparent ? 'brightness(0) invert(1)' : 'none' }} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute', top: '-1px', right: '-4px',
                minWidth: '20px', height: '20px', borderRadius: '10px',
                background: 'var(--c-accent)', color: '#fff',
                fontSize: '9px', fontWeight: '700', display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '0 3px',
                lineHeight: 1,
              }}>
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
