import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faXmark, faTruckFast, faChevronDown, faChevronUp, faHeart as faHeartSolid, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'
import { LuShoppingCart } from 'react-icons/lu'
import { FaRegHeart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import products from '../products.json'
import specialProducts from '../specialProducts.json'
import { resolveImage, resolveDetailImages } from '../utils/imageMap'

const allProducts = [...products, ...specialProducts]

const INFO_ACCORDIONS = [
  { title: '결제 안내', content: '신용/체크카드, 카카오페이, 네이버페이, 무통장입금을 지원합니다.' },
  { title: '배송 안내', content: '배송비는 2,500원이며 50,000원 이상 구매 시 무료입니다. 오후 4시 이전 주문 건은 당일 발송됩니다.' },
  { title: '교환/반품 안내', content: '상품 수령 후 7일 이내 교환/반품 신청이 가능합니다.' },
]

export default function ProductDetailDrawer({ productId, onClose }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isWished } = useWishlist()

  const product = allProducts.find(p => p.id === productId)

  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [colorOverrideImg, setColorOverrideImg] = useState(null)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [added, setAdded] = useState(false)
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState('detail')

  // 상품 바뀔 때 상태 초기화
  useEffect(() => {
    setActiveImg(0)
    setSelectedColor(null)
    setColorOverrideImg(null)
    setOpenAccordion(null)
    setAdded(false)
    setMsg('')
    setActiveTab('detail')
  }, [productId])

  // ESC 키로 닫기
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!product) return null

  const mainImgSrc = resolveImage(product.image)
  const detailImgs = resolveDetailImages(product.image, product.detailFolder)
  const imgSlides = detailImgs.length > 0 ? detailImgs.slice(0, 4) : [mainImgSrc]
  const displayImg = colorOverrideImg ?? imgSlides[activeImg]
  const wished = isWished(product.id)
  const reviews = product.reviews ?? []
  const ratingDist = [5, 4, 3, 2, 1].map(score => ({
    score,
    count: reviews.filter(r => r.rating === score).length,
  }))
  const maxDist = Math.max(1, ...ratingDist.map(d => d.count))
  const totalPrice = selectedColor ? product.salePrice : 0
  const productCode = `P${String(product.id).padStart(6, '0')}M`

  function handleAddCart() {
    if (!selectedColor) { setMsg('상품 컬러를 선택해주세요.'); return }
    setMsg('')
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleBuyNow() {
    if (!selectedColor) { setMsg('상품 컬러를 선택해주세요.'); return }
    setMsg('')
    addToCart(product)
    onClose()
    window.open('/checkout', '_blank')
  }

  const tabs = [
    { key: 'detail', label: '상세정보' },
    { key: 'review', label: `리뷰(${reviews.length})` },
  ]

  return createPortal(
    <>
      {/* 딤 배경 */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 900 }}
      />

      {/* 드로어 패널 */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '600px',
        background: '#f4f6f8',
        overflowY: 'auto',
        zIndex: 901,
        animation: 'drawerSlideIn 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        {/* 헤더 */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: '#fff',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#111', fontSize: '14px', fontWeight: '600' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '16px' }} />
            돌아가기
          </button>
          <button
            onClick={() => { onClose(); navigate(`/products/${product.id}`); window.scrollTo(0, 0) }}
            style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', color: '#555', cursor: 'pointer' }}
          >
            전체 페이지로
          </button>
        </div>

        {/* 메인 이미지 */}
        <div style={{ background: '#fff' }}>
          <div style={{ height: '360px', overflow: 'hidden', background: '#f5f5f5' }}>
            <img
              src={displayImg}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', padding: '12px 20px', overflowX: 'auto' }}>
            {imgSlides.map((src, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: '58px', height: '58px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden',
                  border: activeImg === i ? '2px solid #111' : '2px solid #eee',
                  background: '#f5f5f5', cursor: 'pointer',
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* 제품명 · 가격 */}
          <div style={{ padding: '10px 20px 24px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#111', lineHeight: 1.35, marginBottom: '10px' }}>
              {product.name}
            </h2>
            <p style={{ fontSize: '13px', color: '#777', lineHeight: 1.6, marginBottom: '16px' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {product.discountRate > 0 && (
                  <p style={{ fontSize: '12px', color: '#bbb', textDecoration: 'line-through', marginBottom: '2px' }}>
                    {product.price.toLocaleString()}원
                  </p>
                )}
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#111', letterSpacing: '-0.5px' }}>
                  {product.discountRate > 0 && (
                    <span style={{ color: '#e03131', fontSize: '17px', marginRight: '6px' }}>{product.discountRate}%</span>
                  )}
                  {product.salePrice.toLocaleString()}<span style={{ fontSize: '15px', fontWeight: '600' }}>원</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 당일배송 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#eef1f4', padding: '14px 20px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, background: 'var(--gradient-brand, #094089)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faTruckFast} style={{ color: '#fff', fontSize: '15px' }} />
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#111', marginBottom: '2px' }}>당일배송 오후 4시 마감</p>
            <p style={{ fontSize: '12px', color: '#888' }}>지금 주문 시 <b style={{ color: 'var(--c-accent)' }}>당일 발송</b> 됩니다.</p>
          </div>
        </div>

        {/* 구매 옵션 */}
        <div style={{ background: '#fff', padding: '20px' }}>
          {[
            ['배송비', '2,500원 (50,000원 이상 무료)'],
            ['상품코드', productCode],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', padding: '6px 0' }}>
              <span style={{ width: '80px', fontSize: '13px', color: '#999', flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: '13px', color: '#333' }}>{v}</span>
            </div>
          ))}

          {/* 컬러 */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ width: '80px', fontSize: '13px', fontWeight: '700', color: '#111', flexShrink: 0 }}>상품컬러</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.colors.map(c => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => {
                    setSelectedColor(c.name)
                    setColorOverrideImg(c.image ? resolveImage(c.image) : null)
                    setMsg('')
                  }}
                  style={{
                    width: '26px', height: '26px', borderRadius: '6px', background: c.hex, cursor: 'pointer',
                    border: selectedColor === c.name ? '2px solid var(--c-accent)' : '2px solid #e0e0e0',
                    outline: selectedColor === c.name ? '2px solid rgba(9,64,137,0.25)' : 'none',
                  }}
                />
              ))}
            </div>
            {selectedColor && <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>{selectedColor}</span>}
          </div>

          {/* 총 금액 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 4px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>총 구매 금액</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>{totalPrice.toLocaleString()}</span>
          </div>
          {msg && <p style={{ fontSize: '12px', color: '#e03131', textAlign: 'right', marginBottom: '4px' }}>{msg}</p>}

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={() => toggleWishlist(product)}
              style={{
                flex: 1, padding: '14px 0', borderRadius: '4px', background: '#fff',
                border: '1px solid #ddd', fontSize: '13px', fontWeight: '600',
                color: wished ? '#e03131' : '#333', cursor: 'pointer',
              }}
            >
              {wished ? <FontAwesomeIcon icon={faHeartSolid} style={{ marginRight: '6px' }} /> : <FaRegHeart style={{ marginRight: '6px' }} />}
              관심상품
            </button>
            <button
              onClick={handleAddCart}
              style={{ flex: 1, padding: '14px 0', borderRadius: '4px', background: '#fff', border: '1px solid #ddd', fontSize: '13px', fontWeight: '600', color: '#333', cursor: 'pointer' }}
            >
              {added ? '✓ 담겼습니다' : '장바구니'}
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1.4, padding: '14px 0', borderRadius: '4px', border: 'none',
                background: 'var(--gradient-brand, linear-gradient(100deg,#182E4D 0%,#094089 55%,#289DBC 100%))',
                color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              }}
            >
              구매하기
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #ebebeb', marginTop: '10px' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: activeTab === tab.key ? '700' : '400',
                color: activeTab === tab.key ? '#111' : '#aaa',
                borderBottom: activeTab === tab.key ? '2px solid #111' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭: 상세정보 */}
        {activeTab === 'detail' && (
          <div style={{ background: '#fff' }}>
            {imgSlides.slice(0, 2).map((src, i) => (
              <img key={i} src={src} alt={`${product.name} 상세 ${i + 1}`} style={{ width: '100%', display: 'block' }} />
            ))}
            <div style={{ padding: '16px 20px 32px' }}>
              {INFO_ACCORDIONS.map(item => (
                <div key={item.title} style={{ borderTop: '1px solid #ebebeb' }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.title ? null : item.title)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{item.title}</span>
                    <FontAwesomeIcon icon={openAccordion === item.title ? faChevronUp : faChevronDown} style={{ color: '#999', fontSize: '13px' }} />
                  </button>
                  {openAccordion === item.title && (
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, padding: '0 0 14px' }}>{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 탭: 리뷰 */}
        {activeTab === 'review' && (
          <div style={{ background: '#fff', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #ebebeb', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>상품만족도</p>
                <p style={{ fontSize: '28px', fontWeight: '800', color: '#111' }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: '#f5c518', fontSize: '18px', marginRight: '5px' }} />
                  {reviews.length > 0 ? product.rating.toFixed(1) : '0.0'}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                {ratingDist.map(d => (
                  <div key={d.score} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#888', width: '22px', flexShrink: 0 }}>{d.score}점</span>
                    <div style={{ flex: 1, height: '7px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(d.count / maxDist) * 100}%`, height: '100%', background: '#bbb' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {reviews.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '50px 0' }}>게시물이 없습니다</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} style={{ padding: '14px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{r.user}</span>
                    <span style={{ fontSize: '11px', color: '#bbb' }}>{r.date}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#f5c518', marginBottom: '5px' }}>
                    {Array.from({ length: 5 }, (_, k) => (
                      <FontAwesomeIcon key={k} icon={k < r.rating ? faStar : faStarEmpty} style={{ marginRight: '1px' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6 }}>{r.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ height: '40px' }} />
      </div>
    </>,
    document.body
  )
}
