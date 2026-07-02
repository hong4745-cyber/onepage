import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faArrowUp, faChevronRight, faPlus, faMinus, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DigitalPetalsShader from '../components/DigitalPetalsShader'
import ProductCard from '../components/ProductCard'
import CartOptionPopup from '../components/CartOptionPopup'
import products from '../products.json'
import { resolveImage, resolvePlainImage } from '../utils/imageMap'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import iconCart from '../assets/images/icon_cart.png'

import hero1 from '../assets/images/main/main_change/1_main_1.png'
import hero2 from '../assets/images/main/main_change/1_main_2.png'
import hero3 from '../assets/images/main/main_change/1_main_3.png'
import hero4 from '../assets/images/main/main_change/1_main_4.png'
import hero5 from '../assets/images/main/main_change/1_main_5.png'
import hero6 from '../assets/images/main/main_change/1_main_6.png'
import bgParticle from '../assets/images/bg/bg_1.png'
import catHeadphone from '../assets/images/Product/Product_Headphone_01.jpg'
import catEarbud from '../assets/images/Product/Product_Earbud_01.png'
import catWireless from '../assets/images/Product/Product_Wireless-Speaker_01.jpg'
import catLoud from '../assets/images/Product/Product_Loudspeaker_01.jpg'
import catStands from '../assets/images/Product/Product_Speaker-stands_01.jpg'
import sale1 from '../assets/images/Sale/Sale_1.png'
import sale2 from '../assets/images/Sale/Sale_2.png'
import sale3 from '../assets/images/Sale/Sale_3.png'
import bg2 from '../assets/images/bg/bg_2.jpg'
import banner1 from '../assets/images/banner_1_gold.png'
import banner2 from '../assets/images/banner_2_blue.png'
import review1 from '../assets/images/review/review_1.png'
import review2 from '../assets/images/review/review_2.png'
import review3 from '../assets/images/review/review_3.png'

function BestCard({ product, hasDragged }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isWished } = useWishlist()
  const liked = isWished(product.id)
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <div
      onClick={() => { if (!hasDragged?.current) navigate(`/products/${product.id}`) }}
      style={{ flex: 1, minWidth: 0, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', background: '#fff' }}
    >
      <div style={{ position: 'relative', background: '#f4f4f4', aspectRatio: '1/1' }}>
        <img
          src={resolveImage(product.image)} alt={product.name}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button
            onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
            style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: liked ? '#e53e3e' : '#aaa', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={liked ? faHeartSolid : faHeart} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); setPopupOpen(true) }}
            style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <img src={iconCart} alt="장바구니" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          </button>
        </div>
      </div>
      <div style={{ padding: '11px 12px 14px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#111', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
        <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '7px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description?.split('.')[0]}</p>
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>{product.salePrice.toLocaleString()}원</p>
      </div>
      {popupOpen && <CartOptionPopup product={product} onClose={() => setPopupOpen(false)} />}
    </div>
  )
}

const HERO_SLIDES = [
  { shader: true,               title: '사운드가 예술이 되다.',          sub: '빛과 소리가 하나로 어우러지는 순간.\n프리미엄 오디오의 세계로 초대합니다.' },
  { img: hero1, objPos: 'top',    title: '어디서든, 당신만의 사운드.',      sub: '도심 속에서도 완벽한 몰입.\n프리미엄 헤드폰으로 세상과 단절하세요.' },
  { img: hero2, objPos: 'top',    title: '선 없이, 한계 없이.',            sub: '귓속에서 피어나는 섬세한 울림.\n자유로운 하루를 이어버드와 함께하세요.' },
  { img: hero3, objPos: '50% 50%', title: '음악과 공간이 하나되는 순간.',    sub: '헤드폰과 스피커가 어우러진 일상.\n편안함 속에서 깊은 감동을 느끼세요.' },
  { img: hero4, objPos: '5%',    title: '공간을 완성하는 오브제.',         sub: '세련된 디자인과 풍부한 사운드.\n어떤 인테리어도 특별하게 만드는 스피커.' },
  { img: hero5, objPos: '55% 70%', title: '사운드의 정점에 서다.',           sub: '깊은 저음과 선명한 고음의 완벽한 균형.\n공간 전체를 채우는 라우드스피커.' },
  { img: hero6, objPos: '50% 60%', title: '나만의 공간, 나만의 음악.',       sub: '창가의 햇살 아래 흐르는 음악.\n데스크 위 프리미엄 사운드로 하루를 완성하세요.' },
]

const CATEGORIES = [
  { label: '헤드폰',     img: catHeadphone, value: '헤드폰' },
  { label: '이어버드',   img: catEarbud,    value: '이어버드' },
  { label: '무선스피커', img: catWireless,  value: '무선스피커' },
  { label: '라우드스피커', img: catLoud,    value: '라우드스피커' },
  { label: '액세서리',   img: catStands,    value: '액세서리' },
]

const FAQ_LIST = [
  { q: '배송은 얼마나 걸리나요?', a: '주문 후 2–3 영업일 이내 출고되며, 도서산간 지역은 추가 1–2일이 소요될 수 있습니다.' },
  { q: '반품/교환은 어떻게 하나요?', a: '수령 후 7일 이내 고객센터로 문의해 주세요. 제품 하자 시 무상 교환 가능합니다.' },
  { q: 'A/S 서비스는 어디서 받나요?', a: '공식 서비스 센터 또는 온라인 A/S 신청을 통해 이용하실 수 있습니다.' },
  { q: '정품 등록은 어떻게 하나요?', a: '구매 후 공식 홈페이지에서 제품 시리얼 번호로 등록하시면 보증 기간이 연장됩니다.' },
  { q: '해외 배송도 가능한가요?', a: '현재 국내 배송만 지원하고 있으며, 해외 배송은 추후 안내 예정입니다.' },
]

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const isDraggingRef = useRef(false)
  const shouldAnimateRef = useRef(false)
  const dragStartRef = useRef(0)
  const timerRef = useRef(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [showGoTop, setShowGoTop] = useState(false)
  const [activeTab, setActiveTab] = useState('추천')
  const [timeLeft, setTimeLeft] = useState('')
  const [saleTimers, setSaleTimers] = useState([])
  const [adIdx, setAdIdx] = useState(0)
  const [revSlide, setRevSlide] = useState(0)
  const [revDragOffset, setRevDragOffset] = useState(0)
  const revIsDragging = useRef(false)
  const revStartX = useRef(0)
  const revDragOffsetRef = useRef(0)
  const prevRevSlide = useRef(0)
  const [bestPage, setBestPage] = useState(0)
  const [bestDragOffset, setBestDragOffset] = useState(0)
  const bestIsDragging = useRef(false)
  const bestHasDragged = useRef(false)
  const bestStartX = useRef(0)
  const bestDragOffsetRef = useRef(0)
  const [saleSlide, setSaleSlide] = useState(0)
  const [saleDragOffset, setSaleDragOffset] = useState(0)
  const saleIsDragging = useRef(false)
  const saleHasDragged = useRef(false)
  const saleStartX = useRef(0)
  const saleAnimRef = useRef(false)
  const saleDragOffsetRef = useRef(0)
  const saleVelocity = useRef(0)
  const saleLastX = useRef(0)
  const saleLastT = useRef(0)
  const navigate = useNavigate()
  const { toggleWishlist, isWished } = useWishlist()
  const total = HERO_SLIDES.length

  const bestProducts = products.filter(p => p.isBest).slice(0, 6)
  const newProducts = products.filter(p => p.isNew).slice(0, 8)
  const [newVisible, setNewVisible] = useState(4)
  const saleProducts = products.filter(p => p.isSale)
  const saleCount = saleProducts.length
  const saleCatCounts = saleProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const REVIEWS = [
    { img: review1, name: '홍**', rating: 5, title: '음질이 정말 최고예요', text: '디테일이 살아있어서 음악을 새롭게 듣는 느낌이에요.\n저음과 고음의 균형이 완벽해서 어떤 장르든 만족스럽습니다.\n매일 퇴근길이 기다려질 정도예요.' },
    { img: review2, name: '김**', rating: 5, title: '착용감이 너무 편해요', text: '장시간 사용해도 귀가 아프지 않아요.\n무게감도 적당하고 이어패드가 부드러워서 하루 종일 쓰고 있어요.\n강력 추천합니다!' },
    { img: review3, name: '이**', rating: 4, title: '선물용으로도 완벽해요', text: '배송도 빠르고 포장도 꼼꼼했어요.\n선물용으로 구매했는데 반응이 너무 좋았어요.\n고급스러운 패키지 덕분에 뜯는 순간부터 감동이었대요.' },
  ]

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      shouldAnimateRef.current = true
      setSlide(s => (s + 1) % total)
    }, 5000)
  }

  function goSlide(n) {
    shouldAnimateRef.current = true
    setSlide(((n % total) + total) % total)
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    const el = document.querySelector('.page-scroll')
    if (!el) return
    const onScroll = () => setShowGoTop(el.scrollTop > 400)
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    document.querySelector('.page-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const target = new Date()
    target.setDate(target.getDate() + 3)
    target.setHours(0, 0, 0, 0)
    function tick() {
      const diff = target - new Date()
      if (diff <= 0) { setTimeLeft('00일 00시간 00분 00초'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(d).padStart(2,'0')}일 ${String(h).padStart(2,'0')}시간 ${String(m).padStart(2,'0')}분 ${String(s).padStart(2,'0')}초`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const fmt = diff => {
      if (diff <= 0) return '00일 00시간 00분 00초'
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      return `${String(d).padStart(2,'0')}일 ${String(h).padStart(2,'0')}시간 ${String(m).padStart(2,'0')}분 ${String(s).padStart(2,'0')}초`
    }
    const targets = saleProducts.map((_, i) => {
      const t = new Date()
      t.setDate(t.getDate() + (i % 4))
      t.setHours(t.getHours() + [8, 3, 11, 5, 1, 6][i % 6])
      t.setMinutes(t.getMinutes() + [8, 42, 17, 55, 30, 9][i % 6])
      return t
    })
    function tick() {
      const now = new Date()
      setSaleTimers(targets.map(t => fmt(t - now)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setAdIdx(i => (i + 1) % 2), 4000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => { prevRevSlide.current = revSlide }, [revSlide])

  function onRevPointerDown(clientX) {
    revIsDragging.current = true
    revStartX.current = clientX
    revDragOffsetRef.current = 0
    setRevDragOffset(0)
  }
  function onRevPointerMove(clientX) {
    if (!revIsDragging.current) return
    const dx = clientX - revStartX.current
    revDragOffsetRef.current = dx
    setRevDragOffset(dx)
  }
  function onRevPointerUp() {
    if (!revIsDragging.current) return
    revIsDragging.current = false
    const dx = revDragOffsetRef.current
    const total = REVIEWS.length
    setRevSlide(prev => {
      if (dx < -50) return (prev + 1) % total
      if (dx > 50) return (prev - 1 + total) % total
      return prev
    })
    revDragOffsetRef.current = 0
    setRevDragOffset(0)
  }

  function onBestPointerDown(clientX) {
    bestIsDragging.current = true
    bestHasDragged.current = false
    bestStartX.current = clientX
    bestDragOffsetRef.current = 0
    setBestDragOffset(0)
  }
  function onBestPointerMove(clientX) {
    if (!bestIsDragging.current) return
    const dx = clientX - bestStartX.current
    if (Math.abs(dx) > 6) bestHasDragged.current = true
    bestDragOffsetRef.current = dx
    setBestDragOffset(dx)
  }
  function onBestPointerUp() {
    if (!bestIsDragging.current) return
    bestIsDragging.current = false
    const dx = bestDragOffsetRef.current
    const pageCount = Math.ceil(bestProducts.length / 2)
    setBestPage(prev => {
      if (dx < -50 && prev < pageCount - 1) return prev + 1
      if (dx > 50 && prev > 0) return prev - 1
      return prev
    })
    bestDragOffsetRef.current = 0
    setBestDragOffset(0)
  }

  function onSalePointerDown(clientX) {
    saleIsDragging.current = true
    saleHasDragged.current = false
    saleAnimRef.current = false
    saleStartX.current = clientX
    saleDragOffsetRef.current = 0
    saleVelocity.current = 0
    saleLastX.current = clientX
    saleLastT.current = Date.now()
    setSaleDragOffset(0)
  }
  function onSalePointerMove(clientX) {
    if (!saleIsDragging.current) return
    const now = Date.now()
    const dt = now - saleLastT.current
    if (dt > 0) saleVelocity.current = (clientX - saleLastX.current) / dt * 1000
    saleLastX.current = clientX
    saleLastT.current = now
    const dx = clientX - saleStartX.current
    if (Math.abs(dx) > 6) saleHasDragged.current = true
    saleDragOffsetRef.current = dx
    setSaleDragOffset(dx)
  }
  function onSalePointerUp() {
    if (!saleIsDragging.current) return
    saleIsDragging.current = false
    saleAnimRef.current = true
    const dx = saleDragOffsetRef.current
    const v  = saleVelocity.current
    setSaleSlide(prev => {
      const last = saleProducts.length - 1
      if ((v < -250 || dx < -50) && prev < last) return prev + 1
      if ((v >  250 || dx >  50) && prev > 0)    return prev - 1
      return prev
    })
    saleDragOffsetRef.current = 0
    saleVelocity.current = 0
    setSaleDragOffset(0)
  }

  function onDragStart(clientX) {
    clearInterval(timerRef.current)
    isDraggingRef.current = true
    shouldAnimateRef.current = false
    dragStartRef.current = clientX
  }

  // window 레벨 이벤트: 슬라이더 영역 밖으로 나가도 드래그 유지
  useEffect(() => {
    function onMove(e) {
      if (!isDraggingRef.current) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      setDragOffset(clientX - dragStartRef.current)
    }
    function onUp(e) {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
      const diff = dragStartRef.current - clientX
      if (Math.abs(diff) > 50) {
        shouldAnimateRef.current = true
        setDragOffset(0)
        setSlide(s => {
          const t = HERO_SLIDES.length
          return diff > 0 ? (s + 1) % t : (s - 1 + t) % t
        })
      } else {
        shouldAnimateRef.current = false
        setDragOffset(0)
      }
      startTimer()
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <div className="page-root">
      <Header />
      <div className="page-scroll">

        {/* Hero Slider */}
        <div
          style={{ background: 'rgb(17,17,17)', position: 'relative', height: '816px', overflow: 'hidden', cursor: 'grab', userSelect: 'none' }}
          onMouseDown={e => { e.preventDefault(); onDragStart(e.clientX) }}
          onTouchStart={e => onDragStart(e.touches[0].clientX)}
        >
          {HERO_SLIDES.map((s, i) => {
            let pos = i - slide
            if (pos > total / 2) pos -= total
            if (pos < -total / 2) pos += total
            return (
              <div
                key={i}
                style={{
                  position: 'absolute', inset: 0,
                  transform: `translateX(calc(${pos * 100}% + ${dragOffset}px))`,
                  transition: (isDraggingRef.current || !shouldAnimateRef.current || Math.abs(pos) > 1) ? 'none' : 'transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                  pointerEvents: 'none',
                }}
              >
                {s.shader ? (
                  <DigitalPetalsShader zoom={1.45} />
                ) : (
                  <img
                    src={s.img} alt=""
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.objPos, display: 'block' }}
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: s.shader ? 'rgba(0,0,0,0.15)' : 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65))' }} />
                <div style={{ position: 'absolute', textAlign: 'center', left: 0, bottom: '10%', width: '100%', zIndex: 3, padding: '0 20px' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 'var(--fw-regular)', marginBottom: '12px', lineHeight: 1.3, wordBreak: 'keep-all' }}>{s.title}</h2>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{s.sub}</span>
                </div>
              </div>
            )
          })}
          {/* 연결된 선 인디케이터 — gap 없이 한 줄, 활성만 두껍게 */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', alignItems: 'center', height: '4px', zIndex: 10, pointerEvents: 'auto' }}>
            {HERO_SLIDES.map((_, i) => (
              <div
                key={i}
                onClick={() => goSlide(i)}
                style={{
                  flex: 1,
                  height: slide === i ? '2px' : '1px',
                  background: slide === i ? '#fff' : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  transition: 'height 0.25s ease, background 0.25s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Category Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '36px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => navigate(`/products?category=${cat.value}`)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                  background: 'none', border: 'none', cursor: 'pointer', minWidth: '90px',
                }}
              >
                <div style={{
                  width: '88px', height: '88px', borderRadius: '50%', background: '#f5f5f5',
                  overflow: 'hidden',
                }}>
                  <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '13px', color: '#444', whiteSpace: 'nowrap' }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 브랜드 태그라인 */}
        <div style={{ padding: '64px 40px 32px', textAlign: 'center', background: '#fff' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', lineHeight: 1.4, marginBottom: '12px', wordBreak: 'keep-all' }}>
            좋아하는 음악을<br />처음 듣는 것처럼
          </h2>
          <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}>지금 바로 경험해보세요!</p>
        </div>


        {/* section02 비디오 */}
        <section style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
          <video
            autoPlay muted loop playsInline
            style={{ width: '100%', minHeight: '600px', display: 'block', objectFit: 'cover', pointerEvents: 'none', border: 'none', outline: 'none' }}
          >
            <source src="/videos/main_video.mp4" type="video/mp4" />
          </video>
        </section>

        {/* section03 추천상품 */}
        {bestProducts.length > 0 && (
          <section style={{ padding: '40px 0 32px' }}>
            {/* 헤더 */}
            <div style={{ textAlign: 'center', marginBottom: '24px', padding: '0 20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', fontSize: '22px', fontWeight: '700', color: '#111' }}>추천상품</span>
              </div>
              <p style={{ fontSize: '13px', color: '#999' }}>가장 많이 사랑받은 베스트 상품을 만나보세요.</p>
            </div>

            {/* 스와이프 캐러셀 */}
            <div
              style={{ position: 'relative', overflow: 'hidden', cursor: 'grab', userSelect: 'none', paddingBottom: '40px' }}
              onMouseDown={e => onBestPointerDown(e.clientX)}
              onMouseMove={e => onBestPointerMove(e.clientX)}
              onMouseUp={onBestPointerUp}
              onMouseLeave={onBestPointerUp}
              onTouchStart={e => onBestPointerDown(e.touches[0].clientX)}
              onTouchMove={e => onBestPointerMove(e.touches[0].clientX)}
              onTouchEnd={onBestPointerUp}
            >
              <div style={{
                display: 'flex',
                transform: `translateX(calc(-${bestPage * 100}% + ${bestDragOffset}px))`,
                transition: bestIsDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                willChange: 'transform',
              }}>
                {Array.from({ length: Math.ceil(bestProducts.length / 2) }).map((_, pageIdx) => (
                  <div key={pageIdx} style={{ flex: '0 0 100%', display: 'flex', gap: '12px', padding: '0 20px', boxSizing: 'border-box' }}>
                    {bestProducts.slice(pageIdx * 2, pageIdx * 2 + 2).map(p => (
                      <BestCard key={p.id} product={p} hasDragged={bestHasDragged} />
                    ))}
                  </div>
                ))}
              </div>

              {/* 연결된 선 인디케이터 — 히어로 슬라이더와 동일 디자인 */}
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', alignItems: 'center', height: '4px', zIndex: 10, pointerEvents: 'auto' }}>
                {Array.from({ length: Math.ceil(bestProducts.length / 2) }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setBestPage(i)}
                    style={{
                      flex: 1,
                      height: bestPage === i ? '2px' : '1px',
                      background: bestPage === i ? '#111' : 'rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      transition: 'height 0.25s ease, background 0.25s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* section04 타임세일 */}
        <section style={{ background: '#0f1923', padding: '32px 0 32px', userSelect: 'none' }}>

          {/* 제목 */}
          <p style={{ color: '#fff', fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '4px' }}>
            타임세일🔥
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', textAlign: 'center', marginBottom: '20px' }}>
            시간이 지나면 이가격은 사라져요.
          </p>



          {/* 포커스 캐러셀 */}
          <div
            style={{ position: 'relative', height: '760px', overflow: 'hidden', cursor: 'grab' }}
            onMouseDown={e => onSalePointerDown(e.clientX)}
            onMouseMove={e => onSalePointerMove(e.clientX)}
            onMouseUp={onSalePointerUp}
            onMouseLeave={onSalePointerUp}
            onTouchStart={e => onSalePointerDown(e.touches[0].clientX)}
            onTouchMove={e => { e.preventDefault(); onSalePointerMove(e.touches[0].clientX) }}
            onTouchEnd={onSalePointerUp}
          >
            {saleProducts.map((p, i) => {
              const CARD_W = 414
              const STEP   = 426
              const rawX   = (i - saleSlide) * STEP + saleDragOffset
              const absD   = Math.abs(rawX) / STEP
              const isCenter = absD < 0.5
              const scale  = Math.max(0.6, 1 - Math.min(absD, 2) * 0.25)
              const opacity= Math.max(0.55, 1 - Math.min(absD, 2) * 0.28)
              const zIndex = Math.round(20 - absD * 5)
              const noAnim = saleIsDragging.current

              return (
                <div
                  key={p.id}
                  onClick={() => { if (!saleHasDragged.current) navigate(`/products/${p.id}`) }}
                  style={{
                    position: 'absolute', left: '50%', top: '50%',
                    width: `${CARD_W}px`,
                    transform: `translate(calc(-50% + ${rawX}px), -50%) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: noAnim ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.45, 0.64, 1), opacity 0.4s ease',
                    background: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: isCenter ? '0 20px 60px rgba(0,0,0,0.55)' : '0 6px 20px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  {/* 개별 카운트다운 배너 */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0d1f3c 0%, #094089 60%, #1a7ab5 100%)',
                    padding: '11px 14px',
                    textAlign: 'center',
                  }}>
                    <span style={{
                      color: '#fff', fontSize: '15px', fontWeight: '700',
                      letterSpacing: '1px', fontVariantNumeric: 'tabular-nums',
                    }}>
                      {saleTimers[i] || '00일 00시간 00분 00초'}
                    </span>
                  </div>

                  {/* 상품 이미지 */}
                  <div style={{ position: 'relative', height: '500px', background: '#f7f7f7' }}>
                    <img
                      src={resolvePlainImage(p.image)} alt={p.name}
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button onClick={e => { e.stopPropagation(); toggleWishlist(p) }} style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', color: isWished(p.id) ? '#e53e3e' : '#aaa', cursor: 'pointer',
                    }}>
                      <FontAwesomeIcon icon={isWished(p.id) ? faHeartSolid : faHeart} />
                    </button>
                  </div>

                  {/* 상품 정보 */}
                  <div style={{ padding: '14px 16px 18px' }}>
                    <p style={{ fontSize: '11px', color: '#bbb', marginBottom: '5px', letterSpacing: '0.2px' }}>{p.category}</p>
                    <p style={{
                      fontSize: '14px', fontWeight: '500', color: '#111', lineHeight: 1.4, marginBottom: '10px',
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{p.name}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '17px', fontWeight: '700', color: '#111' }}>{p.salePrice.toLocaleString()}원</span>
                      <span style={{ fontSize: '11px', color: '#ccc', textDecoration: 'line-through' }}>{p.price.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 도트 인디케이터 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '18px' }}>
            {saleProducts.map((_, i) => (
              <div
                key={i}
                onClick={() => { saleAnimRef.current = true; setSaleSlide(i) }}
                style={{
                  width: i === saleSlide ? '20px' : '6px', height: '6px',
                  borderRadius: '3px', cursor: 'pointer',
                  background: i === saleSlide ? '#6ACDFF' : 'rgba(255,255,255,0.22)',
                  transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
              />
            ))}
          </div>

        </section>

        {/* section05 신상품 */}
        {newProducts.length > 0 && (
          <section style={{ padding: '32px 28px' }}>
            <div className="section-header">
              <span className="section-title">신상품</span>
              <span className="section-more" onClick={() => navigate('/products?filter=new')}>전체보기 <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '10px' }} /></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {newProducts.slice(0, newVisible).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {newVisible < newProducts.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <button
                  onClick={() => setNewVisible(v => v + 4)}
                  style={{
                    padding: '12px 48px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '24px',
                    fontSize: '13px',
                    color: '#333',
                    cursor: 'pointer',
                  }}
                >
                  더보기 <FontAwesomeIcon icon={faPlus} style={{ fontSize: '11px', marginLeft: '4px' }} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* 광고 배너 — 자동 롤링 */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0, cursor: 'pointer' }} onClick={() => navigate('/promotions')}>
          <div style={{
            display: 'flex',
            transform: `translateX(-${adIdx * 100}%)`,
            transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}>
            {[banner1, banner2].map((src, i) => (
              <div key={i} style={{ position: 'relative', flex: '0 0 100%', width: '100%' }}>
                <img src={src} alt={`배너 ${i + 1}`} draggable={false}
                  style={{ width: '100%', display: 'block', borderRadius: 0 }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  {i === 0 ? (
                    <>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--c-primary)', marginBottom: '4px' }}>2,000원 할인 쿠폰</p>
                      <p style={{ fontSize: '13px', color: '#555' }}>첫 구매 쿠폰 받기</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--c-primary)', marginBottom: '4px' }}>회원 전용 특가</p>
                      <p style={{ fontSize: '13px', color: '#555' }}>최저가 + 최대 혜택</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 베스트 리뷰 — 포커스 캐러셀 */}
        <section style={{ padding: '36px 0 28px', userSelect: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '0 20px' }}>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>베스트 리뷰</p>
            <p style={{ fontSize: '13px', color: '#999' }}>고객님들의 내돈내산 솔직 후기.</p>
          </div>

          <div
            style={{ position: 'relative', height: '520px', overflow: 'hidden', cursor: 'grab' }}
            onMouseDown={e => { e.preventDefault(); onRevPointerDown(e.clientX) }}
            onMouseMove={e => onRevPointerMove(e.clientX)}
            onMouseUp={onRevPointerUp}
            onMouseLeave={onRevPointerUp}
          >
            {REVIEWS.map((rev, i) => {
              const CARD_W = 430
              const STEP   = 450
              const total  = REVIEWS.length
              const norm = n => {
                let p = n
                if (p >  total / 2) p -= total
                if (p < -total / 2) p += total
                return p
              }
              const pos     = norm(i - revSlide)
              const prevPos = norm(i - prevRevSlide.current)
              const wrapJump = Math.abs(pos - prevPos) > 1.5
              const rawX   = pos * STEP + revDragOffset
              const absD   = Math.abs(rawX) / STEP
              const scale  = Math.max(0.85, 1 - Math.min(absD, 2) * 0.15)
              const opacity= Math.max(0.5, 1 - Math.min(absD, 2) * 0.5)
              const noAnim = revIsDragging.current || wrapJump

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute', left: '50%', top: 0,
                    width: `${CARD_W}px`,
                    transform: `translateX(calc(-50% + ${rawX}px)) scale(${scale})`,
                    transformOrigin: 'top center',
                    opacity,
                    transition: noAnim ? 'none' : 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease',
                    background: '#fff',
                  }}
                >
                  <img
                    src={rev.img} alt=""
                    draggable={false}
                    style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '10px', display: 'block' }}
                  />
                  <div style={{ padding: '18px 4px 0' }}>
                    <p style={{ fontSize: '17px', fontWeight: '700', color: '#111', marginBottom: '10px' }}>{rev.title}</p>
                    <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '12px' }}>{rev.text}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <FontAwesomeIcon key={j} icon={faStar} style={{ color: j < rev.rating ? '#f5a623' : '#e8e8e8', fontSize: '11px' }} />
                        ))}
                      </span>
                      <span style={{ fontSize: '11px', color: '#aaa' }}>{rev.name}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 리뷰 더보기 */}
          <div style={{ padding: '20px 28px 0' }}>
            <button
              onClick={() => navigate('/reviews')}
              style={{
                width: '100%', padding: '15px 0',
                background: '#fff', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '14px', color: '#111', cursor: 'pointer',
              }}
            >
              리뷰 더보기
            </button>
          </div>
        </section>

        {/* 전시 절전 배너 (START WITH US) */}
        <div style={{
          position: 'relative', height: '900px', overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 6%, 100% 100%, 0 100%)',
        }}>
          <img src={bgParticle} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(8,6,38,0.5)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start',
            padding: '90px 40px 0',
          }}>
            <h2 style={{
              color: '#fff', fontSize: '40px', fontWeight: '300',
              lineHeight: 1.25, letterSpacing: '1px', marginBottom: '28px',
            }}>
              START<br />WITH US.
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.82)', fontSize: '13px', lineHeight: 2.1,
              marginBottom: '32px', wordBreak: 'keep-all',
            }}>
              좋은 사운드 그 이상의 경험.<br />
              공간의 깊이를 느끼고,<br />
              감정의 결을 발견하며,<br />
              음악 본연의 감동을 경험하는 것.<br />
              Bowers &amp; Wilkins는<br />
              그 순간을 위해 만들어집니다.
            </p>
            <button onClick={() => navigate('/company')} style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.7)', color: '#fff',
              padding: '11px 44px', fontSize: '12px', letterSpacing: '1px',
              cursor: 'pointer',
            }}>더보기</button>
          </div>
        </div>

        {/* FAQ */}
        <section style={{ padding: '32px 28px', borderTop: '1px solid #ebebeb' }}>
          <div className="section-header">
            <span className="section-title">자주 묻는 질문</span>
          </div>
          {FAQ_LIST.map((item, i) => (
            <div key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '13px 0', background: 'none', border: 'none',
                fontSize: '13px', fontWeight: '400', color: '#111', textAlign: 'left', cursor: 'pointer',
              }}>
                {item.q}
                <FontAwesomeIcon icon={openFaq === i ? faMinus : faPlus} style={{ color: '#bbb', fontSize: '12px', marginLeft: '8px', flexShrink: 0 }} />
              </button>
              {openFaq === i && (
                <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.75', padding: '0 0 14px' }}>{item.a}</p>
              )}
            </div>
          ))}
          <div style={{ borderTop: '1px solid #f0f0f0' }} />
        </section>

        <Footer />
      </div>

      {/* GoTop 버튼 */}
      {showGoTop && (
        <div style={{
          position: 'fixed', bottom: '76px', left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 200,
        }}>
          <div style={{ width: '600px', maxWidth: '100%', position: 'relative' }}>
            <button onClick={scrollToTop} style={{
              position: 'absolute', right: '20px', bottom: 0,
              pointerEvents: 'auto',
              width: '44px', height: '44px', borderRadius: '50%',
              background: '#111', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '14px',
            }}><FontAwesomeIcon icon={faArrowUp} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
