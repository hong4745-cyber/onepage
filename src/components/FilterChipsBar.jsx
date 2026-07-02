import { useNavigate, useLocation } from 'react-router-dom'

const CHIPS = [
  { label: '전체', query: '' },
  { label: 'BEST', query: 'filter=best' },
  { label: 'NEW',  query: 'filter=new' },
  { label: 'SALE', query: 'filter=sale' },
]

// 신제품 페이지의 필터 칩과 동일한 위치·스타일의 공통 바로가기 칩 바
export default function FilterChipsBar() {
  const navigate = useNavigate()
  const { search } = useLocation()

  return (
    <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', borderBottom: '1px solid #f8f8f8' }}>
      {CHIPS.map(({ label, query }) => {
        const active = query ? search.includes(query) : false
        return (
          <button
            key={label}
            onClick={() => navigate(`/products${query ? '?' + query : ''}`)}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              border: active ? '1px solid #111' : '1px solid #e0e0e0',
              background: active ? '#111' : '#fff',
              color: active ? '#fff' : '#666',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
