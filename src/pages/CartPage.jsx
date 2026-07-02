import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterChipsBar from '../components/FilterChipsBar'
import { useCart } from '../context/CartContext'
import { resolveImage } from '../utils/imageMap'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQty, totalCount, totalPrice } = useCart()

  return (
    <div className="page-root">
      <Header showBack title="장바구니" />

      <div className="page-scroll">
        <FilterChipsBar />
        {cart.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '16px' }}>
            <p style={{ fontSize: '44px' }}>🛍</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#111' }}>장바구니가 비었습니다</p>
            <p style={{ fontSize: '13px', color: '#aaa' }}>마음에 드는 제품을 담아보세요</p>
            <button
              onClick={() => navigate('/products')}
              style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}
            >
              제품 보러 가기
            </button>
          </div>
        ) : (
          <div style={{ paddingBottom: '16px' }}>
            {cart.map(item => (
              <div
                key={item.id}
                style={{ display: 'flex', gap: '12px', padding: '16px', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' }}
              >
                <img
                  src={resolveImage(item.image)}
                  alt={item.name}
                  onClick={() => navigate(`/products/${item.id}`)}
                  style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5', flexShrink: 0, cursor: 'pointer' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>{item.category}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', lineHeight: '1.4', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#111', marginBottom: '10px' }}>
                    {(item.salePrice * item.qty).toLocaleString()}원
                  </p>
                  {/* 수량 조절 */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '6px 0 0 6px', background: '#fafafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <FontAwesomeIcon icon={faMinus} style={{ fontSize: '10px', color: '#555' }} />
                    </button>
                    <span style={{ width: '36px', height: '28px', border: '1px solid #ddd', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#111' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '0 6px 6px 0', background: '#fafafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <FontAwesomeIcon icon={faPlus} style={{ fontSize: '10px', color: '#555' }} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
                >
                  <FontAwesomeIcon icon={faTrash} style={{ fontSize: '14px', color: '#ccc' }} />
                </button>
              </div>
            ))}
          </div>
        )}
        <Footer />
      </div>

      {/* 하단 결제 바 */}
      {cart.length > 0 && (
        <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #f0f0f0', background: '#fff', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>총 결제금액</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#111' }}>
              {totalPrice.toLocaleString()}원
            </span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%', padding: '15px', background: '#111', color: '#fff',
              border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            }}
          >
            구매하기 ({totalCount}개)
          </button>
        </div>
      )}
    </div>
  )
}
