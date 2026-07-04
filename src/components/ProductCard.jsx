import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { LuShoppingCart } from 'react-icons/lu'
import { FaRegHeart } from 'react-icons/fa'
import { resolveImage } from '../utils/imageMap'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import CartOptionPopup from './CartOptionPopup'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isWished } = useWishlist()
  const liked = isWished(product.id)
  const [heartAnim, setHeartAnim] = useState(false)
  const [cartActive, setCartActive] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)

  function handleCartClick(e) {
    e.stopPropagation()
    setCartActive(true)
    setPopupOpen(true)
  }

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-card-img">
        {product.isBest && <span className="product-badge badge-best">BEST</span>}
        {product.isNew && <span className="product-badge badge-new">NEW</span>}
        {product.isSale && !product.isBest && !product.isNew && (
          <span className="product-badge badge-sale">SALE</span>
        )}
        <img src={resolveImage(product.image)} alt={product.name} loading="lazy" />
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            className="card-action-btn"
            onClick={handleCartClick}
            style={{ background: 'rgba(255,255,255,0.9)', outline: cartActive ? '2px solid var(--c-accent)' : 'none' }}
          >
            <LuShoppingCart style={{ fontSize: '16px' }} />
          </button>
          <button
            className="card-action-btn"
            onClick={e => {
              e.stopPropagation()
              toggleWishlist(product)
              setHeartAnim(true)
              setTimeout(() => setHeartAnim(false), 400)
            }}
            style={{ color: liked ? 'var(--c-accent)' : undefined }}
          >
            {liked
              ? <FontAwesomeIcon icon={faHeartSolid} className={heartAnim ? 'heart-pop' : ''} />
              : <FaRegHeart className={heartAnim ? 'heart-pop' : ''} />
            }
          </button>
        </div>
      </div>
      <p className="product-category">{product.category}</p>
      <p className="product-name">{product.name}</p>
      <div className="product-price-row">
        {product.discountRate > 0 && (
          <span className="price-discount">{product.discountRate}%</span>
        )}
        <span className="price-sale">{product.salePrice.toLocaleString()}원</span>
        {product.price !== product.salePrice && (
          <span className="price-original">{product.price.toLocaleString()}원</span>
        )}
      </div>
      <div className="product-rating-row">
        <FontAwesomeIcon icon={faStar} style={{ color: '#f59e0b', marginRight: '3px', fontSize: '11px' }} />
        {product.rating} ({product.reviewCount})
      </div>

      {popupOpen && (
        <CartOptionPopup
          product={product}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </div>
  )
}
