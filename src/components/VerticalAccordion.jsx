import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiGlobe, FiShoppingBag, FiHelpCircle, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import imgBrand    from '../assets/images/bg/main_Background.png'
import imgProduct  from '../assets/images/Product/Product_Headphone_01.jpg'
import imgSupport  from '../assets/images/Product/Product_Wireless-Speaker_01.jpg'
import imgMy       from '../assets/images/Product/Product_Earbud_01.png'

const TAB_W  = 44   // px — 4 tabs × 44 = 176
const PANEL_W = 184 // px — 360 - 176 = 184

const ITEMS = [
  {
    id: 1,
    title: '나의쇼핑',
    Icon: FiUser,
    imgSrc: imgMy,
    items: [
      { label: '로그인',   path: '/login' },
      { label: '회원가입', path: '/signup' },
      { label: '나의쇼핑', path: '/mypage' },
    ],
  },
  {
    id: 2,
    title: '고객지원',
    Icon: FiHelpCircle,
    imgSrc: imgSupport,
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
    Icon: FiShoppingBag,
    imgSrc: imgProduct,
    items: [
      { label: '신제품',       path: '/products?filter=new' },
      { label: '맥라렌 에디션', path: '/special' },
      { label: '헤드폰',       path: '/products?category=헤드폰' },
      { label: '이어버드',     path: '/products?category=이어버드' },
      { label: '무선 스피커',  path: '/products?category=무선스피커' },
      { label: '액세서리',     path: '/products?category=액세서리' },
      { label: '프로모션',     path: '/promotions' },
    ],
  },
  {
    id: 4,
    title: 'Bowers & Wilkins 소개',
    Icon: FiGlobe,
    imgSrc: imgBrand,
    overlay: 0.55,
    items: [
      { label: '회사소개', path: '/company' },
      { label: 'FAQ',     path: '/faq' },
    ],
  },
]

const panelVariants = {
  open:   { width: PANEL_W, opacity: 1 },
  closed: { width: 0,       opacity: 0 },
}

const listVariants = {
  open:   { opacity: 1, x: 0,   transition: { delay: 0.1, staggerChildren: 0.04 } },
  closed: { opacity: 0, x: -10 },
}

const itemVariants = {
  open:   { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -8 },
}

function Panel({ open, setOpen, id, Icon, title, imgSrc, items, overlay = 0.75 }) {
  const isOpen = open === id
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* 탭 버튼 */}
      <button
        onClick={() => setOpen(id)}
        style={{
          width: `${TAB_W}px`,
          flexShrink: 0,
          height: '100%',
          background: isOpen
            ? 'linear-gradient(100deg, #182E4D 0%, #094089 55%, #289DBC 80%)'
            : '#fff',
          border: 'none',
          borderRight: '1px solid #ebebeb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '20px',
          gap: '10px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.3s',
        }}
      >
        <Icon
          size={15}
          style={{ color: isOpen ? '#fff' : 'var(--c-accent)', flexShrink: 0 }}
        />
        <span style={{
          writingMode: 'vertical-lr',
          fontSize: '12px',
          fontWeight: isOpen ? '600' : '400',
          color: isOpen ? '#fff' : '#555',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </span>

        {/* 활성 화살표 */}
        {isOpen && (
          <span style={{
            position: 'absolute',
            right: -5,
            top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            width: 9, height: 9,
            background: 'linear-gradient(55deg, #14619B 0%, #1F82AF 100%)',
            zIndex: 20,
          }} />
        )}
      </button>

      {/* 펼쳐지는 콘텐츠 패널 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`content-${id}`}
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              height: '100%',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* 오버레이 */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `rgba(4,9,34,${overlay})`,
              backdropFilter: 'blur(2px)',
            }} />

            {/* 목록 */}
            <motion.div
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                position: 'relative', zIndex: 1,
                padding: '20px 14px',
                display: 'flex', flexDirection: 'column', gap: '2px',
                height: '100%', overflowY: 'auto',
              }}
            >
              <p style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.45)',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                marginBottom: '10px', fontWeight: '600',
              }}>
                {title}
              </p>
              {items.map(sub => (
                <motion.button
                  key={sub.label}
                  variants={itemVariants}
                  onClick={() => navigate(sub.path)}
                  style={{
                    background: 'none', border: 'none',
                    color: '#fff', fontSize: '13px',
                    textAlign: 'left', cursor: 'pointer',
                    padding: '7px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  whileHover={{ x: 4, color: 'var(--c-accent-light)' }}
                  transition={{ duration: 0.15 }}
                >
                  {sub.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function VerticalAccordion() {
  const [open, setOpen] = useState(ITEMS[0].id)

  return (
    <div style={{
      display: 'flex',
      height: '420px',
      overflow: 'hidden',
      borderTop: '1px solid #ebebeb',
    }}>
      {ITEMS.map(item => (
        <Panel key={item.id} open={open} setOpen={setOpen} {...item} />
      ))}
    </div>
  )
}
