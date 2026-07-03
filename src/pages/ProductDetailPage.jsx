import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHeart as faHeartSolid, faPlus, faMinus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarEmpty, faHeart } from '@fortawesome/free-regular-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterChipsBar from '../components/FilterChipsBar'
import ProductCard from '../components/ProductCard'
import products from '../products.json'
import specialProducts from '../specialProducts.json'
import { resolveImage, resolveDetailImages } from '../utils/imageMap'

const allProducts = [...products, ...specialProducts]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = allProducts.find(p => p.id === Number(id))

  const { addToCart } = useCart()
  const [activeImg, setActiveImg] = useState(0)
  const [openReview, setOpenReview] = useState(false)
  const [added, setAdded] = useState(false)
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

  function handleAddCart() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
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
  // detail 폴더에 메인 컷 포함 슬라이드 전체가 들어 있으므로 그대로 사용, 없으면 메인 이미지만 표시
  const imgSlides = detailImgs.length > 0 ? detailImgs.slice(0, 4) : [mainImgSrc]
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="page-root">
      <Header showBack />
      <div className="page-scroll">
        <FilterChipsBar />

        {/* Image Slider */}
        <div style={{ position: 'relative', background: '#f5f5f5' }}>
          <div
            style={{ height: '360px', overflow: 'hidden', cursor: 'zoom-in' }}
            onClick={() => setImgPopup(true)}
          >
            <img
              src={imgSlides[activeImg]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Thumbnail row */}
          <div style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: '#fff', overflowX: 'auto' }}>
            {imgSlides.map((src, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: '52px', height: '52px', flexShrink: 0,
                  borderRadius: '6px', overflow: 'hidden',
                  border: activeImg === i ? '2px solid #111' : '2px solid transparent',
                  background: '#f5f5f5', cursor: 'pointer',
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ padding: '20px 16px' }}>
          <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>{product.category}</p>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#111', lineHeight: '1.4', marginBottom: '12px' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <span style={{ color: '#f59e0b', fontSize: '13px' }}>
              {Array.from({ length: 5 }, (_, j) => (
                <FontAwesomeIcon key={j} icon={j < Math.floor(product.rating) ? faStar : faStarEmpty} style={{ marginRight: '1px' }} />
              ))}
            </span>
            <span style={{ fontSize: '13px', color: '#666' }}>{product.rating}</span>
            <span style={{ fontSize: '12px', color: '#aaa' }}>리뷰 {product.reviewCount}개</span>
          </div>

          {/* Price */}
          <div style={{ borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', padding: '14px 0', marginBottom: '16px' }}>
            {product.discountRate > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#e03131' }}>{product.discountRate}%</span>
                <span style={{ fontSize: '12px', color: '#ccc', textDecoration: 'line-through' }}>
                  {product.price.toLocaleString()}원
                </span>
              </div>
            )}
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#111', letterSpacing: '-0.5px' }}>
              {product.salePrice.toLocaleString()}원
            </p>
          </div>

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '16px', border: '1px solid #ebebeb', borderRadius: '6px', overflow: 'hidden' }}>
            {[
              ['색상', product.color],
              ['연결방식', product.connectivity],
              ['재고', `${product.stock}개`],
              ['평점', `${product.rating} / 5.0`],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#fafafa', padding: '10px 12px', borderRight: '1px solid #ebebeb' }}>
                <p style={{ fontSize: '10px', color: '#bbb', marginBottom: '3px', letterSpacing: '0.3px' }}>{k}</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Review Keywords */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {product.reviewKeywords.map(kw => (
              <span key={kw} style={{
                border: '1px solid #ebebeb', borderRadius: '3px',
                padding: '4px 10px', fontSize: '11px', color: '#777',
              }}>
                #{kw}
              </span>
            ))}
          </div>

          {/* Description */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#111' }}>상품 설명</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#555' }}>{product.description}</p>
          </div>

          {/* Reviews */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', marginBottom: '20px' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openReview ? '14px' : '0' }}
              onClick={() => setOpenReview(!openReview)}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>리뷰 ({product.reviewCount})</h3>
              <FontAwesomeIcon icon={openReview ? faMinus : faPlus} style={{ color: '#aaa', fontSize: '14px' }} />
            </div>
            {openReview && product.reviews.map(r => (
              <div key={r.id} style={{ paddingBottom: '14px', marginBottom: '14px', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{r.user}</span>
                  <span style={{ fontSize: '11px', color: '#bbb' }}>{r.date}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '5px' }}>
                  {Array.from({ length: r.rating }, (_, k) => <FontAwesomeIcon key={k} icon={faStar} style={{ marginRight: '1px' }} />)}
                </div>
                <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>{r.content}</p>
              </div>
            ))}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '14px' }}>
                같은 카테고리 제품
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Add to Cart */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0',
        background: '#fff',
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
      }}>
        <button style={{
          flex: 1, padding: '14px', borderRadius: '10px',
          border: '1px solid #111', background: '#fff',
          color: '#111', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        }}>
          <FontAwesomeIcon icon={faHeart} style={{ marginRight: '6px' }} />찜하기
        </button>
        <button
          onClick={handleAddCart}
          style={{
            flex: 2, padding: '14px', borderRadius: '10px',
            background: added ? '#094089' : '#111', color: '#fff',
            border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          {added ? '✓ 담겼습니다' : '장바구니 담기'}
        </button>
      </div>
      {/* Image Popup */}
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

      <Footer />
    </div>
  )
}
