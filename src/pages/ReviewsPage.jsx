import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BoardTabs from '../components/BoardTabs'
import FilterChipsBar from '../components/FilterChipsBar'
import { useAuth } from '../context/AuthContext'
import { subscribeBoardPosts } from '../firebase/board'
import { resolvePlainImage } from '../utils/imageMap'

export default function ReviewsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [type, setType] = useState('photo')
  const [keyword, setKeyword] = useState('')
  const [searchBy, setSearchBy] = useState('내용')

  useEffect(() => {
    return subscribeBoardPosts('reviews', setReviews, err => console.error('reviews load failed', err))
  }, [])

  const visibleReviews = useMemo(() => {
    let result = type === 'photo'
      ? reviews.filter(r => r.imageUrl)
      : reviews.filter(r => !r.imageUrl)

    const needle = keyword.trim().toLowerCase()
    if (needle) {
      result = result.filter(r => {
        const haystack =
          searchBy === '작성자' ? (r.authorEmail || '') :
          searchBy === '상품명' ? (r.productName || '') :
          (r.content || '')
        return haystack.toLowerCase().includes(needle)
      })
    }
    return result
  }, [reviews, type, keyword, searchBy])

  return (
    <div className="page-root">
      <Header showBack title="리뷰" />
      <div className="page-scroll">

        {/* 게시판 탭 — 공통 sticky */}
        <BoardTabs />
        <FilterChipsBar />

        {/* 타이틀 */}
        <div style={{ textAlign: 'center', padding: '36px 20px 28px' }}>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>리뷰</p>
          <p style={{ fontSize: '12px', color: '#999' }}>상품 사용 후기입니다.</p>
        </div>

        {/* 리뷰 타입 탭 */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 20px', marginBottom: '20px' }}>
          {[
            { key: 'photo',  label: '포토리뷰 타입' },
            { key: 'normal', label: '일반리뷰 타입' },
          ].map(t => {
            const active = type === t.key
            return (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                style={{
                  padding: '9px 18px',
                  background: active ? '#fff' : '#f5f5f5',
                  border: active ? '1px solid #111' : '1px solid #e5e5e5',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: active ? '600' : '400',
                  color: active ? '#111' : '#888',
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {visibleReviews.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px 20px 0', fontSize: '13px', color: '#bbb' }}>
            등록된 리뷰가 없습니다.
          </p>
        )}

        {/* 포토리뷰 그리드 */}
        {type === 'photo' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '0 20px' }}>
            {visibleReviews.map(r => (
              <div
                key={r.id}
                onClick={() => navigate(`/products/${r.productId}`)}
                style={{
                  background: '#fff', border: '1px solid #eee', borderRadius: '10px',
                  overflow: 'hidden', cursor: 'pointer',
                }}
              >
                <div style={{ aspectRatio: '1/1', background: '#f7f7f7' }}>
                  <img
                    src={r.imageUrl} alt={r.productName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  <p style={{
                    fontSize: '12px', fontWeight: '600', color: '#111', marginBottom: '8px',
                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{r.content}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', gap: '1px' }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <FontAwesomeIcon key={j} icon={faStar} style={{ color: j < r.rating ? '#f5a623' : '#e8e8e8', fontSize: '10px' }} />
                      ))}
                    </span>
                    <span style={{ fontSize: '10px', color: '#bbb' }}>{r.authorEmail}</span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    border: '1px solid #f0f0f0', borderRadius: '6px', padding: '7px 9px',
                  }}>
                    <img
                      src={resolvePlainImage(r.productImage)} alt=""
                      style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                    <span style={{
                      fontSize: '10px', color: '#999', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{r.productName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 일반리뷰 리스트 */}
        {type === 'normal' && (
          <div style={{ padding: '0 20px' }}>
            {visibleReviews.map(r => (
              <div
                key={r.id}
                onClick={() => navigate(`/products/${r.productId}`)}
                style={{ borderBottom: '1px solid #f0f0f0', padding: '16px 4px', cursor: 'pointer' }}
              >
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '6px' }}>
                  {r.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', gap: '1px' }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <FontAwesomeIcon key={j} icon={faStar} style={{ color: j < r.rating ? '#f5a623' : '#e8e8e8', fontSize: '10px' }} />
                    ))}
                  </span>
                  <span style={{ fontSize: '11px', color: '#bbb' }}>{r.authorEmail}</span>
                  <span style={{ fontSize: '11px', color: '#ccc' }}>{r.date.toISOString().slice(0, 10)}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#aaa' }}>{r.productName}</p>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', padding: '28px 0 8px' }}>
          <button style={{ background: 'none', border: 'none', fontSize: '11px', color: '#bbb', cursor: 'pointer' }}>처음</button>
          <button style={{ background: 'none', border: 'none', fontSize: '10px', color: '#bbb', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#111', borderBottom: '1px solid #111', padding: '0 2px' }}>1</span>
          <button style={{ background: 'none', border: 'none', fontSize: '10px', color: '#bbb', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <button style={{ background: 'none', border: 'none', fontSize: '11px', color: '#bbb', cursor: 'pointer' }}>끝</button>
        </div>

        {/* 검색 + 글쓰기 */}
        <div style={{ padding: '16px 20px 36px', borderTop: '1px solid #f5f5f5', marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <select
              value={searchBy}
              onChange={e => setSearchBy(e.target.value)}
              style={{
                padding: '10px 8px', border: '1px solid #ddd', borderRadius: '4px',
                fontSize: '12px', color: '#555', background: '#fff', outline: 'none',
              }}
            >
              <option>내용</option>
              <option>작성자</option>
              <option>상품명</option>
            </select>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="검색어를 입력해주세요"
              style={{
                flex: 1, padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px',
                fontSize: '12px', outline: 'none',
              }}
            />
          </div>
          <button
            onClick={() => navigate(user ? '/reviews/write' : '/login')}
            style={{
              width: '100%', padding: '13px 0',
              background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: '4px',
              fontSize: '13px', color: '#333', cursor: 'pointer',
            }}
          >
            글쓰기
          </button>
        </div>

        <Footer />
      </div>
    </div>
  )
}
