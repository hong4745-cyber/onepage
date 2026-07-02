import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterChipsBar from '../components/FilterChipsBar'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../context/WishlistContext'

export default function WishlistPage() {
  const navigate = useNavigate()
  const { wishlist } = useWishlist()

  return (
    <div className="page-root">
      <Header showBack title="관심상품" />
      <div className="page-scroll">
        <FilterChipsBar />

        {wishlist.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '16px' }}>
            <p style={{ fontSize: '44px' }}>💙</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#111' }}>관심상품이 없습니다</p>
            <p style={{ fontSize: '13px', color: '#aaa' }}>마음에 드는 제품에 하트를 눌러보세요</p>
            <button
              onClick={() => navigate('/products')}
              style={{ marginTop: '8px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '13px', cursor: 'pointer' }}
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <>
            <div style={{ padding: '14px 16px 0', fontSize: '12px', color: '#888' }}>
              총 <strong style={{ color: '#111' }}>{wishlist.length}</strong>개 상품
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 16px 32px' }}>
              {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

        <Footer />
      </div>
    </div>
  )
}
