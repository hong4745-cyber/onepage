import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { LuShoppingCart } from 'react-icons/lu'

import catHeadphone from '../assets/images/Product/Product_Headphone_01.jpg'
import catEarbud from '../assets/images/Product/Product_Earbud_01.png'
import catWireless from '../assets/images/Product/Product_Wireless-Speaker_01.jpg'
import catLoud from '../assets/images/Product/Product_Loudspeaker_01.jpg'
import catStands from '../assets/images/Product/Product_Speaker-stands_01.jpg'

export const CATEGORIES = [
  { label: '헤드폰',     img: catHeadphone, value: '헤드폰' },
  { label: '이어버드',   img: catEarbud,    value: '이어버드' },
  { label: '무선스피커', img: catWireless,  value: '무선스피커' },
  { label: '라우드스피커', img: catLoud,    value: '라우드스피커' },
  { label: '액세서리',   img: catStands,    value: '액세서리' },
]

// 카테고리 5종 + 장바구니 + 맨위로 이동 — 스크롤해도 항상 고정되는 오른쪽 세로 플로팅 버튼.
// .layout-right 바깥(document.body)에 렌더링해 블랙 버전 필터가 fixed 위치 기준을 바꿔버리는 문제를 피한다.
export default function FloatingActions() {
  const navigate = useNavigate()

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return createPortal(
    <div className="hero-float-btns">
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => navigate(`/products?category=${cat.value}`)}
          aria-label={cat.label}
          style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: '#f5f5f5', border: 'none', cursor: 'pointer',
            padding: 0, overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      ))}
      <button onClick={() => navigate('/cart')} style={{
        width: '52px', height: '52px', borderRadius: '50%',
        background: '#fff', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)', color: '#222',
      }}>
        <LuShoppingCart style={{ fontSize: '20px' }} />
      </button>
      <button onClick={scrollToTop} style={{
        width: '52px', height: '52px', borderRadius: '50%',
        background: '#fff', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)', color: '#222',
      }}>
        <div style={{ width: '16px', height: '2px', background: '#222', borderRadius: '1px' }} />
        <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '14px' }} />
      </button>
    </div>,
    document.body,
  )
}
