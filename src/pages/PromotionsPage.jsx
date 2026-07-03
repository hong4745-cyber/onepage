import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCategoryBar from '../components/ProductCategoryBar'
import FilterChipsBar from '../components/FilterChipsBar'
import specialProducts from '../specialProducts.json'
import { resolveImage } from '../utils/imageMap'

const ITEMS = specialProducts.filter(p => p.category === '프로모션')

export default function PromotionsPage() {
  const navigate = useNavigate()

  return (
    <div className="page-root">
      <Header showBack title="프로모션" />
      <div className="page-scroll">
        <ProductCategoryBar />
        <FilterChipsBar />
        <div style={{ padding: '20px 16px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {ITEMS.map(p => (
              <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} style={{ cursor: 'pointer' }}>
                <img
                  src={resolveImage(p.image)}
                  alt={p.name}
                  style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'cover', aspectRatio: '1 / 1' }}
                />
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#111', marginTop: '8px', lineHeight: '1.4' }}>{p.name}</p>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#111', marginTop: '2px' }}>
                  {p.discountRate > 0 && <span style={{ color: '#e03131', marginRight: '4px' }}>{p.discountRate}%</span>}
                  {p.salePrice.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
