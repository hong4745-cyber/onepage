import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { MdSearch } from 'react-icons/md'
import { useSearch } from '../context/SearchContext'
import { resolveImage } from '../utils/imageMap'
import { searchScore } from '../utils/koreanSearch'
import products from '../products.json'

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useSearch()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  if (!searchOpen) return null

  const trimmed = query.trim()
  const results = trimmed.length > 0
    ? products
        .map(p => ({ p, score: searchScore(p, trimmed) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ p }) => p)
        .slice(0, 20)
    : []

  function goTo(id) {
    setSearchOpen(false)
    setQuery('')
    navigate(`/products/${id}`)
  }

  function close() {
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 500,
      background: '#fff', display: 'flex', flexDirection: 'column',
    }}>
      {/* 검색 입력 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '14px 16px', borderBottom: '1px solid #ebebeb',
      }}>
        <MdSearch style={{ fontSize: '18px', opacity: 0.5, flexShrink: 0 }} />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && close()}
          placeholder="제품명 또는 카테고리 검색..."
          style={{ flex: 1, fontSize: '15px', border: 'none', outline: 'none', color: '#111', background: 'transparent' }}
        />
        <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
          <FontAwesomeIcon icon={faXmark} style={{ color: '#aaa', fontSize: '20px' }} />
        </button>
      </div>

      {/* 결과 목록 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {trimmed === '' && (
          <p style={{ padding: '48px 16px', textAlign: 'center', fontSize: '13px', color: '#bbb' }}>
            검색어를 입력해 주세요
          </p>
        )}
        {trimmed !== '' && results.length === 0 && (
          <p style={{ padding: '48px 16px', textAlign: 'center', fontSize: '13px', color: '#bbb' }}>
            "{trimmed}"에 대한 검색 결과가 없습니다
          </p>
        )}
        {results.map(p => (
          <div
            key={p.id}
            onClick={() => goTo(p.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
            }}
          >
            <img
              src={resolveImage(p.image)}
              alt={p.name}
              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="product-category">{p.category}</p>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                {p.discountRate > 0 && (
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#e03131' }}>{p.discountRate}%</span>
                )}
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>
                  {p.salePrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
