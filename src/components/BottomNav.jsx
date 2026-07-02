import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import iconCart from '../assets/images/icon_cart.png'
import iconHeart from '../assets/images/icon_heart.png'
import iconSearch from '../assets/images/icon_search.png'
import iconUser from '../assets/images/icon_user.png'
import { useMenu } from '../context/MenuContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useSearch } from '../context/SearchContext'

const NAV = [
  { label: '관심상품', path: '/wishlist', customIcon: iconHeart, showBadge: true },
  { label: '장바구니', path: '/cart',    customIcon: iconCart, showBadge: true, isCartBadge: true },
  null,
  { label: '상품검색', path: null,      customIcon: iconSearch, isSearch: true },
  { label: '나의쇼핑', path: '/mypage', customIcon: iconUser },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { setOverlayOpen } = useMenu()
  const { totalCount } = useCart()
  const { wishCount } = useWishlist()
  const { setSearchOpen } = useSearch()

  function isActive(path) {
    if (!path) return false
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  function handleClick(item) {
    if (item.isSearch) { setSearchOpen(true); return }
    navigate(item.path)
  }

  return (
    <div className="bottom-nav-wrapper">
      <button
        className="bottom-nav-fab"
        onClick={() => setOverlayOpen(o => !o)}
        aria-label="메뉴"
      >
        <FontAwesomeIcon icon={faBars} style={{ color: '#fff', fontSize: '30px' }} />
      </button>

      <nav className="bottom-nav">
        {NAV.map((item, i) => {
          if (!item) return <div key="fab-gap" className="bnav-fab-gap" />
          const active = isActive(item.path)
          const iconDef = active ? item.activeIcon : item.icon
          const badgeCount = item.isCartBadge ? totalCount : wishCount
          return (
            <button
              key={item.label}
              className={`bnav-btn${active ? ' active' : ''}`}
              onClick={() => handleClick(item)}
            >
              <span className="bnav-icon-wrap">
                {item.customIcon
                  ? <img src={item.customIcon} alt={item.label} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  : <FontAwesomeIcon icon={active ? item.activeIcon : item.icon} style={{ fontSize: '26px' }} />
                }
                {item.showBadge && (
                  <span className="bnav-badge">{badgeCount > 99 ? '99+' : badgeCount}</span>
                )}
              </span>
              <span className="bnav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
