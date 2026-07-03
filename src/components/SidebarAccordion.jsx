import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMenu } from '../context/MenuContext'
import logoImg from '../assets/images/0_logo.png'
import SignupPopup from './SignupPopup'
import { InteractiveImageAccordion } from './ui/interactive-image-accordion'

import imgBrand   from '../assets/images/bg/main_Background.png'
import imgProduct from '../assets/images/Product/Product_Headphone_01.jpg'
import imgSupport from '../assets/images/Product/Product_Wireless-Speaker_01.jpg'
import imgMy      from '../assets/images/Product/Product_Earbud_01.png'

const ACCORDION_ITEMS = [
  {
    id: 1,
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
    id: 2,
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
    title: '나의쇼핑',
    imageUrl: imgMy,
    items: [
      { label: '로그인',   path: '/login' },
      { label: '회원가입', path: '/signup' },
      { label: '나의쇼핑', path: '/mypage' },
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
  const { overlayOpen, setOverlayOpen } = useMenu()

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
          <button className="sidebar-auth-btn cursor-target" onClick={() => setSignupOpen(true)}>
            회원가입
          </button>
          <button className="sidebar-auth-btn cursor-target" onClick={() => navigate('/login')}>
            로그인
          </button>
        </div>
      </div>

      <div style={{ padding: '35px 30px' }}>
        <InteractiveImageAccordion items={ACCORDION_ITEMS} />
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
