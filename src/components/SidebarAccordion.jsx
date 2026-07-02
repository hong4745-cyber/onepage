import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../assets/images/0_logo.png'
import SignupPopup from './SignupPopup'
import VerticalAccordion from './VerticalAccordion'

const MENU = [
  {
    section: '바워스앤윌킨스',
    items: [
      { label: '회사소개', path: '/company' },
      { label: 'FAQ', path: '/faq' },
    ],
  },
  {
    section: '제품구매하기',
    items: [
      { label: '신제품', path: '/products?filter=new' },
      { label: '맥라렌 에디션', path: '/special' },
      { label: '헤드폰', path: '/products?category=헤드폰' },
      { label: '이어버드', path: '/products?category=이어버드' },
      { label: '무선 스피커', path: '/products?category=무선스피커' },
      { label: '스피커', path: '/products?category=라우드스피커' },
      { label: '액세서리', path: '/products?category=액세서리' },
      { label: '프로모션', path: '/promotions' },
    ],
  },
  {
    section: '고객지원',
    items: [
      { label: '공지사항', path: '/notice' },
      { label: '리뷰', path: '/reviews' },
      { label: '상품문의', path: '/qna' },
      { label: '이벤트', path: '/events' },
    ],
  },
  {
    section: '나의쇼핑',
    items: [
      { label: '로그인', path: '/login' },
      { label: '회원가입', path: '/signup' },
    ],
  },
]

export default function SidebarAccordion() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [signupOpen, setSignupOpen] = useState(false)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-area">
        <img
          src={logoImg}
          alt="Bowers & Wilkins"
          className="sidebar-logo-img"
          onClick={() => navigate('/')}
        />
        <p className="sidebar-tagline">특별하고 다양한 혜택 받으세요!</p>
        <div className="sidebar-auth-toolbar" role="toolbar" aria-label="회원 메뉴">
          <button className="sidebar-auth-btn" onClick={() => setSignupOpen(true)}>
            회원가입
          </button>
          <button className="sidebar-auth-btn" onClick={() => navigate('/login')}>
            로그인
          </button>
        </div>
      </div>

      <VerticalAccordion />

      {signupOpen && (
        <SignupPopup
          onClose={() => setSignupOpen(false)}
          onLoginClick={() => { setSignupOpen(false); navigate('/login') }}
        />
      )}
    </aside>
  )
}
