import { useNavigate, useLocation } from 'react-router-dom'
import { GoHome, GoPerson } from 'react-icons/go'
import { LuShoppingCart } from 'react-icons/lu'
import { MdSearch } from 'react-icons/md'
import { FaRegHeart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useSearch } from '../context/SearchContext'

const NAV = [
  { label: '관심상품', path: '/wishlist', ReactIcon: FaRegHeart, showBadge: true },
  { label: '장바구니', path: '/cart',    ReactIcon: LuShoppingCart, showBadge: true, isCartBadge: true },
  null,
  { label: '상품검색', path: null,      ReactIcon: MdSearch, isSearch: true },
  { label: '나의쇼핑', path: '/mypage', ReactIcon: GoPerson },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
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
        onClick={() => navigate('/')}
        aria-label="홈"
      >
        <GoHome style={{ color: '#fff', fontSize: '38px' }} />
      </button>

      <nav className="bottom-nav">
        {NAV.map((item) => {
          if (!item) return <div key="fab-gap" className="bnav-fab-gap" />
          const active = isActive(item.path)
          const badgeCount = item.isCartBadge ? totalCount : wishCount
          return (
            <button
              key={item.label}
              className={`bnav-btn${active ? ' active' : ''}`}
              onClick={() => handleClick(item)}
            >
              <span className="bnav-icon-wrap">
                <item.ReactIcon style={{ fontSize: '40px' }} />
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
