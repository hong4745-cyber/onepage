import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaInstagram, FaYoutube, FaFacebookF } from 'react-icons/fa'
import { useMenu } from '../context/MenuContext'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/images/0_logo.png'
import SignupPopup from './SignupPopup'
import { InteractiveImageAccordion } from './ui/interactive-image-accordion'
import { getRecentlyViewed } from '../utils/recentlyViewed'

import imgBrand   from '../assets/images/bg/main_Background.png'
import imgProduct from '../assets/images/Product/Product_Headphone_01.jpg'
import imgSupport from '../assets/images/Product/Product_Wireless-Speaker_01.jpg'
import imgMy      from '../assets/images/Product/Product_Earbud_01.png'

const ACCORDION_ITEMS = [
  {
    id: 1,
    title: '고객지원',
    imageUrl: imgSupport,
    items: [
      { label: '공지사항', path: '/notice' },
      { label: '리뷰',     path: '/reviews' },
      { label: '상품문의', path: '/qna' },
      { label: '이벤트',   path: '/events' },
    ],
  },
  {
    id: 3,
    title: '제품구매하기',
    imageUrl: imgProduct,
    items: [
      { label: '신제품',        path: '/products?filter=new' },
      { label: '맥라렌 에디션',  path: '/special' },
      { label: '헤드폰',        path: '/products?category=헤드폰' },
      { label: '이어버드',      path: '/products?category=이어버드' },
      { label: '무선 스피커',   path: '/products?category=무선스피커' },
      { label: '스피커',        path: '/products?category=라우드스피커' },
      { label: '액세서리',      path: '/products?category=액세서리' },
      { label: '프로모션',      path: '/promotions' },
    ],
  },
  {
    id: 4,
    title: 'B&W 소개',
    imageUrl: imgBrand,
    items: [
      { label: '회사소개', path: '/company' },
      { label: 'FAQ',     path: '/faq' },
    ],
  },
]

export default function SidebarAccordion() {
  const navigate = useNavigate()
  const [signupOpen, setSignupOpen] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const { overlayOpen, setOverlayOpen } = useMenu()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (overlayOpen) setRecentlyViewed(getRecentlyViewed())
  }, [overlayOpen])

  const myShoppingItem = {
    id: 2,
    title: '나의쇼핑',
    imageUrl: imgMy,
    items: user
      ? [
          { label: '나의쇼핑', path: '/mypage' },
          { label: '로그아웃', onClick: logout },
        ]
      : [
          { label: '로그인',   path: '/login' },
          { label: '회원가입', path: '/signup' },
          { label: '나의쇼핑', path: '/mypage' },
        ],
  }

  const accordionItems = [ACCORDION_ITEMS[0], myShoppingItem, ...ACCORDION_ITEMS.slice(1)]

  return (
    <aside className={`sidebar${overlayOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar-logo-area">
        {/* X 닫기 버튼 */}
        <button
          onClick={() => setOverlayOpen(false)}
          style={{
            position: 'absolute', top: '14px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'none', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', color: '#888', cursor: 'pointer', lineHeight: 1,
          }}
          aria-label="메뉴 닫기"
        >
          ✕
        </button>
        <img
          src={logoImg}
          alt="Bowers & Wilkins"
          className="sidebar-logo-img"
          onClick={() => navigate('/')}
        />
        <p className="sidebar-tagline">특별하고 다양한 혜택 받으세요!</p>
        <div className="sidebar-auth-toolbar" role="toolbar" aria-label="회원 메뉴">
          {user ? (
            <>
              <span className="sidebar-auth-email">{user.email}</span>
              <button className="sidebar-auth-btn cursor-target" onClick={logout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="sidebar-auth-btn cursor-target" onClick={() => setSignupOpen(true)}>
                회원가입
              </button>
              <button className="sidebar-auth-btn cursor-target" onClick={() => navigate('/login')}>
                로그인
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: '36px 30px 24px' }}>
        <InteractiveImageAccordion items={accordionItems} />
      </div>

      <div style={{ flex: 1 }} />

      {/* C. 최근 본 상품 */}
      {recentlyViewed.length > 0 && (
        <div className="sidebar-recently-viewed">
          <p className="sidebar-rv-label">최근 본 상품</p>
          <div className="sidebar-rv-list">
            {recentlyViewed.map(p => (
              <button
                key={p.id}
                className="sidebar-rv-item"
                onClick={() => { navigate(`/products/${p.id}`); setOverlayOpen(false) }}
              >
                <img src={p.image} alt={p.name} className="sidebar-rv-img" />
                <span className="sidebar-rv-name">{p.name}</span>
                <span className="sidebar-rv-price">
                  {(p.salePrice || p.price).toLocaleString()}원
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* A. 브랜드 카피 + 소셜 링크 */}
      <div className="sidebar-brand-footer">
        <p className="sidebar-brand-tagline">"Hear More of What You Love"</p>
        <div className="sidebar-social-row">
          <a href="https://www.instagram.com/bowersandwilkins" target="_blank" rel="noreferrer" className="sidebar-social-link" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.youtube.com/@BowersWilkins" target="_blank" rel="noreferrer" className="sidebar-social-link" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="https://www.facebook.com/BowersWilkins" target="_blank" rel="noreferrer" className="sidebar-social-link" aria-label="Facebook">
            <FaFacebookF />
          </a>
        </div>
        <p className="sidebar-copyright">© 2025 Bowers &amp; Wilkins Korea</p>
      </div>

      {signupOpen && (
        <SignupPopup
          onClose={() => setSignupOpen(false)}
          onLoginClick={() => { setSignupOpen(false); navigate('/login') }}
        />
      )}
    </aside>
  )
}
