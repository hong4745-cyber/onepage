import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductCategoryBar from '../components/ProductCategoryBar'
import products from '../products.json'

const SORT_OPTIONS = ['추천순', '낮은가격순', '높은가격순', '리뷰많은순']

export default function ProductListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') || '전체')
  const [filter, setFilter]     = useState(searchParams.get('filter')   || '')
  const [sort, setSort]         = useState('추천순')

  useEffect(() => {
    setCategory(searchParams.get('category') || '전체')
    setFilter(searchParams.get('filter') || '')
  }, [searchParams])

  const pageTitle = filter === 'new'
    ? '신제품'
    : category === '라우드스피커'
      ? '스피커'
      : (category === '전체' ? '제품' : category)

  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== '전체') list = list.filter(p => p.category === category)
    if (filter === 'best') list = list.filter(p => p.isBest)
    if (filter === 'new') list = list.filter(p => p.isNew)
    if (filter === 'sale') list = list.filter(p => p.isSale)
    if (sort === '낮은가격순') list.sort((a, b) => a.salePrice - b.salePrice)
    if (sort === '높은가격순') list.sort((a, b) => b.salePrice - a.salePrice)
    if (sort === '리뷰많은순') list.sort((a, b) => b.reviewCount - a.reviewCount)
    return list
  }, [category, sort, filter])

  return (
    <div className="page-root">
      <Header showBack title={pageTitle} />

      <div className="page-scroll">
        <ProductCategoryBar />

        {/* Filter Chips + Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f8f8f8' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[['', '전체'], ['best', 'BEST'], ['new', 'NEW'], ['sale', 'SALE']].filter(([val]) => !(val === 'new' && filter === 'new')).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(filter === val ? '' : val)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: filter === val ? '1px solid #111' : '1px solid #e0e0e0',
                  background: filter === val ? '#111' : '#fff',
                  color: filter === val ? '#fff' : '#666',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ fontSize: '12px', border: 'none', color: '#666', background: 'none', cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Count */}
        <div style={{ padding: '12px 16px 0', fontSize: '12px', color: '#888' }}>
          총 <strong style={{ color: '#111' }}>{filtered.length}</strong>개 제품
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 16px 32px' }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '16px' }}>해당 조건의 제품이 없습니다.</p>
            <button
              onClick={() => { setCategory('전체'); setFilter('') }}
              style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', cursor: 'pointer' }}
            >
              전체 보기
            </button>
          </div>
        )}
        <Footer />
      </div>
    </div>
  )
}
