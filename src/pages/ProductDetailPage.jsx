import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faXmark, faTruckFast, faChevronDown, faChevronUp, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarEmpty, faHeart } from '@fortawesome/free-regular-svg-icons'
import { RiKakaoTalkFill } from 'react-icons/ri'
import Header from '../components/Header'
import Footer from '../components/Footer'
import products from '../products.json'
import specialProducts from '../specialProducts.json'
import { resolveImage, resolveDetailImages } from '../utils/imageMap'

const allProducts = [...products, ...specialProducts]

// 색상명 → 스와치 컬러
const COLOR_HEX = [
  ['미드나잇 블루', '#1e2a4a'],
  ['클라우드 그레이', '#cfd2d4'],
  ['갤버나이즈드 그레이', '#8a8a8a'],
  ['파파야 오렌지', '#e87722'],
  ['더스티 핑크', '#c8a2a8'],
  ['소프트 골드', '#c9a86a'],
  ['골드 베이지', '#d8c9a8'],
  ['글로스 블랙', '#101010'],
  ['버건디', '#7a2e3e'],
  ['모카', '#6b4f3a'],
  ['베이지', '#d8c9a8'],
  ['화이트', '#f0efeb'],
  ['그레이', '#9a9a9a'],
  ['실버', '#c0c0c0'],
  ['네이비', '#1e2a4a'],
  ['블루', '#2a4a7a'],
  ['골드', '#c9a86a'],
  ['블랙', '#1a1a1a'],
]

function colorToHex(name) {
  const found = COLOR_HEX.find(([key]) => name.includes(key))
  return found ? found[1] : '#999'
}

const INFO_ACCORDIONS = [
  {
    title: '결제 안내',
    content: '신용/체크카드, 카카오페이, 네이버페이, 무통장입금을 지원합니다. 고액 결제의 경우 안전을 위해 카드사에서 확인 전화를 드릴 수 있습니다.',
  },
  {
    title: '배송 안내',
    content: '배송비는 2,500원이며 50,000원 이상 구매 시 무료입니다. 오후 4시 이전 주문 건은 당일 발송되며, 배송 기간은 영업일 기준 1~3일입니다.',
  },
  {
    title: '교환/반품 안내',
    content: '상품 수령 후 7일 이내 교환/반품 신청이 가능합니다. 단순 변심의 경우 왕복 배송비가 부과되며, 제품 불량 시 무상으로 처리됩니다.',
  },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = allProducts.find(p => p.id === Number(id))

  const { addToCart } = useCart()
  const { toggleWishlist, isWished } = useWishlist()

  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('detail')
  const [selectedColor, setSelectedColor] = useState(null)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [added, setAdded] = useState(false)
  const [msg, setMsg] = useState('')

  const [imgPopup, setImgPopup] = useState(false)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })

  function handleZoomMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom({ active: true, x, y })
  }

  function closeImgPopup() {
    setImgPopup(false)
    setZoom({ active: false, x: 50, y: 50 })
  }

  if (!product) {
    return (
      <div className="page-root">
        <Header showBack />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px' }}>
          <div style={{ fontSize: '48px' }}>🎧</div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>제품을 찾을 수 없습니다</p>
          <p style={{ fontSize: '13px', color: '#aaa' }}>삭제되었거나 잘못된 주소입니다.</p>
          <button
            onClick={() => navigate('/')}
            style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    )
  }

  const mainImgSrc = resolveImage(product.image)
  const detailImgs = resolveDetailImages(product.image, product.detailFolder)
  const imgSlides = detailImgs.length > 0 ? detailImgs.slice(0, 4) : [mainImgSrc]
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6)
  const colors = product.color.split('/').map(c => c.trim())
  const totalPrice = selectedColor ? product.salePrice : 0
  const productCode = `P${String(product.id).padStart(6, '0')}M`
  const wished = isWished(product.id)

  // 리뷰 별점 분포
  const reviews = product.reviews ?? []
  const ratingDist = [5, 4, 3, 2, 1].map(score => ({
    score,
    count: reviews.filter(r => r.rating === score).length,
  }))
  const maxDist = Math.max(1, ...ratingDist.map(d => d.count))

  function requireColor() {
    if (!selectedColor) {
      setMsg('상품 컬러를 선택해주세요.')
      return false
    }
    setMsg('')
    return true
  }

  function handleAddCart() {
    if (!requireColor()) return
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleBuyNow() {
    if (!requireColor()) return
    addToCart(product)
    navigate('/checkout')
  }

  const tabs = [
    { key: 'detail', label: '상세정보' },
    { key: 'review', label: `리뷰(${reviews.length})` },
    { key: 'qna',    label: '상품문의(0)' },
  ]

  return (
    <div className="page-root">
      <Header showBack />
      <div className="page-scroll" style={{ background: '#f4f6f8' }}>

        {/* ===== 메인 이미지 ===== */}
        <div style={{ background: '#fff' }}>
          <div
            style={{ height: '400px', overflow: 'hidden', cursor: 'zoom-in', background: '#f5f5f5' }}
            onClick={() => setImgPopup(true)}
          >
            <img
              src={imgSlides[activeImg]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* 썸네일 */}
          <div style={{ display: 'flex', gap: '10px', padding: '14px 20px', overflowX: 'auto' }}>
            {imgSlides.map((src, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: '64px', height: '64px', flexShrink: 0,
                  borderRadius: '10px', overflow: 'hidden',
                  border: activeImg === i ? '2px solid #111' : '2px solid #eee',
                  background: '#f5f5f5', cursor: 'pointer',
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* ===== 제품명 · 설명 · 가격 ===== */}
          <div style={{ padding: '10px 20px 24px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', lineHeight: 1.35, marginBottom: '10px' }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '13px', color: '#777', lineHeight: 1.6, marginBottom: '18px' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {product.discountRate > 0 && (
                  <p style={{ fontSize: '12px', color: '#bbb', textDecoration: 'line-through', marginBottom: '2px' }}>
                    {product.price.toLocaleString()}원
                  </p>
                )}
                <p style={{ fontSize: '26px', fontWeight: '800', color: '#111', letterSpacing: '-0.5px' }}>
                  {product.discountRate > 0 && (
                    <span style={{ color: '#e03131', fontSize: '18px', marginRight: '8px' }}>{product.discountRate}%</span>
                  )}
                  {product.salePrice.toLocaleString()}
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>원</span>
                </p>
              </div>
              <button
                onClick={() => navigate('/coupons')}
                style={{
                  border: '1px solid var(--c-accent)', color: 'var(--c-accent)', background: '#fff',
                  borderRadius: '6px', padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                쿠폰 받기
              </button>
            </div>
          </div>
        </div>

        {/* ===== 당일배송 안내 ===== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#eef1f4', padding: '16px 20px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
            background: 'var(--gradient-brand, #094089)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FontAwesomeIcon icon={faTruckFast} style={{ color: '#fff', fontSize: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '2px' }}>당일배송 오후 4시 마감</p>
            <p style={{ fontSize: '12px', color: '#888' }}>
              지금 주문 시 <b style={{ color: 'var(--c-accent)' }}>당일 발송</b> 됩니다.
            </p>
          </div>
        </div>

        {/* ===== 구매 정보 ===== */}
        <div style={{ background: '#fff', padding: '20px' }}>
          {[
            ['원산지', '국내'],
            ['배송비', '2,500원 (50,000원 이상 구매 시 무료)'],
            ['상품코드', productCode],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', padding: '7px 0' }}>
              <span style={{ width: '80px', fontSize: '13px', color: '#999', flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: '13px', color: '#333' }}>{v}</span>
            </div>
          ))}

          {/* 상품컬러 */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ width: '80px', fontSize: '13px', fontWeight: '700', color: '#111', flexShrink: 0 }}>상품컬러</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {colors.map(c => (
                <button
                  key={c}
                  title={c}
                  onClick={() => { setSelectedColor(c); setMsg('') }}
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    background: colorToHex(c), cursor: 'pointer',
                    border: selectedColor === c ? '2px solid var(--c-accent)' : '2px solid #e0e0e0',
                    outline: selectedColor === c ? '2px solid rgba(9,64,137,0.25)' : 'none',
                  }}
                />
              ))}
            </div>
            {selectedColor && <span style={{ fontSize: '12px', color: '#666', marginLeft: '12px' }}>{selectedColor}</span>}
          </div>

          {/* 총 구매 금액 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0 6px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>총 구매 금액</span>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#111' }}>
              {totalPrice.toLocaleString()}
            </span>
          </div>
          {msg && <p style={{ fontSize: '12px', color: '#e03131', textAlign: 'right', marginBottom: '4px' }}>{msg}</p>}

          {/* 버튼 3개 */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button
              onClick={() => toggleWishlist(product)}
              style={{
                flex: 1, padding: '15px 0', borderRadius: '4px', background: '#fff',
                border: '1px solid #ddd', fontSize: '14px', fontWeight: '600',
                color: wished ? '#e03131' : '#333', cursor: 'pointer',
              }}
            >
              <FontAwesomeIcon icon={wished ? faHeartSolid : faHeart} style={{ marginRight: '6px' }} />
              관심상품
            </button>
            <button
              onClick={handleAddCart}
              style={{
                flex: 1, padding: '15px 0', borderRadius: '4px', background: '#fff',
                border: '1px solid #ddd', fontSize: '14px', fontWeight: '600', color: '#333', cursor: 'pointer',
              }}
            >
              {added ? '✓ 담겼습니다' : '장바구니'}
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1.4, padding: '15px 0', borderRadius: '4px', border: 'none',
                background: 'var(--gradient-brand, linear-gradient(100deg, #182E4D 0%, #094089 55%, #289DBC 100%))',
                color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              }}
            >
              구매하기
            </button>
          </div>

          {/* 카카오 채널 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#f4f5f7', borderRadius: '8px', padding: '13px 16px', marginTop: '12px',
          }}>
            <span style={{
              width: '26px', height: '26px', borderRadius: '50%', background: '#FEE500', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RiKakaoTalkFill style={{ color: '#3c1e1e', fontSize: '16px' }} />
            </span>
            <p style={{ fontSize: '13px', color: '#333' }}>
              카카오톡 채널 추가하고 <b>추가 할인</b> 받기
            </p>
          </div>
        </div>

        {/* ===== 탭 ===== */}
        <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #ebebeb', marginTop: '10px' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '15px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: activeTab === tab.key ? '700' : '400',
                color: activeTab === tab.key ? '#111' : '#aaa',
                borderBottom: activeTab === tab.key ? '2px solid #111' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== 탭: 상세정보 ===== */}
        {activeTab === 'detail' && (
          <div style={{ background: '#fff' }}>
            {/* 상세 컷 (2장) */}
            {imgSlides.slice(0, 2).map((src, i) => (
              <img key={i} src={src} alt={`${product.name} 상세 ${i + 1}`} style={{ width: '100%', display: 'block' }} />
            ))}

            {/* 함께 구매하면 좋은 상품 */}
            {related.length > 0 && (
              <div style={{ padding: '28px 20px 8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111', marginBottom: '16px' }}>
                  함께 구매하면 좋은 상품
                </h3>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
                  {related.map(p => {
                    const pWished = isWished(p.id)
                    return (
                      <div
                        key={p.id}
                        onClick={() => { navigate(`/products/${p.id}`); window.scrollTo(0, 0) }}
                        style={{ width: '150px', flexShrink: 0, cursor: 'pointer' }}
                      >
                        {/* 이미지 + 아이콘 오버레이 */}
                        <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '10px', overflow: 'hidden', background: '#f5f5f5', border: '1px solid #f0f0f0', marginBottom: '8px' }}>
                          <img src={resolveImage(p.image)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {/* 우측 하단 아이콘 그룹 */}
                          <div
                            onClick={e => e.stopPropagation()}
                            style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                          >
                            <button
                              className="card-action-btn"
                              onClick={() => addToCart(p)}
                              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)', fontSize: '13px' }}
                            >
                              🛒
                            </button>
                            <button
                              className="card-action-btn"
                              onClick={() => toggleWishlist(p)}
                              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)', color: pWished ? 'var(--c-accent)' : undefined }}
                            >
                              <FontAwesomeIcon
                                icon={pWished ? faHeartSolid : faHeart}
                                style={{ fontSize: '13px' }}
                              />
                            </button>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{p.name}</p>
                        {p.discountRate > 0 && (
                          <p style={{ fontSize: '11px', color: '#bbb', textDecoration: 'line-through' }}>{p.price.toLocaleString()}원</p>
                        )}
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>{p.salePrice.toLocaleString()}원</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 안내 아코디언 */}
            <div style={{ padding: '16px 20px 32px' }}>
              {INFO_ACCORDIONS.map(item => (
                <div key={item.title} style={{ borderTop: '1px solid #ebebeb' }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.title ? null : item.title)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '17px 0', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{item.title}</span>
                    <FontAwesomeIcon icon={openAccordion === item.title ? faChevronUp : faChevronDown} style={{ color: '#999', fontSize: '13px' }} />
                  </button>
                  {openAccordion === item.title && (
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, padding: '0 0 16px' }}>{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 탭: 리뷰 ===== */}
        {activeTab === 'review' && (
          <div style={{ background: '#fff', padding: '20px' }}>
            {/* 상품만족도 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
              border: '1px solid #ebebeb', borderRadius: '10px', padding: '22px 20px', marginBottom: '20px',
            }}>
              <div style={{ textAlign: 'center', minWidth: '110px' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>상품만족도</p>
                <p style={{ fontSize: '30px', fontWeight: '800', color: '#111' }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: '#f5c518', fontSize: '20px', marginRight: '6px' }} />
                  {reviews.length > 0 ? product.rating.toFixed(1) : '0.0'}
                </p>
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                {ratingDist.map(d => (
                  <div key={d.score} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11px', color: '#888', width: '24px', flexShrink: 0 }}>{d.score}점</span>
                    <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(d.count / maxDist) * 100}%`, height: '100%', background: '#bbb' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', minWidth: '140px' }}>
                <p style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>고객님의 리뷰를 공유해주세요!</p>
                <button
                  onClick={() => navigate('/reviews')}
                  style={{ border: '1px solid #ddd', background: '#fff', borderRadius: '6px', padding: '10px 18px', fontSize: '13px', color: '#333', cursor: 'pointer' }}
                >
                  리뷰 작성하기
                </button>
              </div>
            </div>

            {/* 리뷰 목록 */}
            {reviews.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '60px 0' }}>게시물이 없습니다</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{r.user}</span>
                    <span style={{ fontSize: '11px', color: '#bbb' }}>{r.date}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#f5c518', marginBottom: '6px' }}>
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

        {/* ===== 탭: 상품문의 ===== */}
        {activeTab === 'qna' && (
          <div style={{ background: '#fff', padding: '20px' }}>
            <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '70px 0' }}>게시물이 없습니다</p>
            <div style={{ display: 'flex', gap: '10px', paddingBottom: '20px' }}>
              <button
                onClick={() => navigate('/qna')}
                style={{ flex: 1, padding: '14px', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', fontSize: '14px', color: '#333', cursor: 'pointer' }}
              >
                질문하기
              </button>
              <button
                onClick={() => navigate('/qna')}
                style={{ flex: 1, padding: '14px', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', fontSize: '14px', color: '#333', cursor: 'pointer' }}
              >
                모두보기
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* ===== 이미지 팝업 (클릭 확대) ===== */}
      {imgPopup && (
        <div
          onClick={closeImgPopup}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', overflow: 'hidden',
          }}
        >
          <button
            onClick={closeImgPopup}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 1,
              width: '40px', height: '40px', borderRadius: '50%',
              border: 'none', background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff', fontSize: '20px', cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {/* 확대 시 이미지가 프레임 밖으로 넘치지 않도록 감싸는 래퍼 */}
          <div
            onClick={e => e.stopPropagation()}
            onMouseMove={handleZoomMove}
            onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
            style={{
              maxWidth: '92%', maxHeight: '88%',
              borderRadius: '8px', overflow: 'hidden',
              cursor: 'zoom-in',
            }}
          >
            <img
              src={imgSlides[activeImg]}
              alt={product.name}
              style={{
                display: 'block', maxWidth: '100%', maxHeight: '88vh',
                objectFit: 'contain', background: '#f5f5f5',
                transform: zoom.active ? 'scale(2.5)' : 'scale(1)',
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transition: 'transform 0.25s ease',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
