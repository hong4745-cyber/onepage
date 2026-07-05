import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BoardTabs from '../components/BoardTabs'
import { useAuth } from '../context/AuthContext'
import { subscribeBoardPosts, filterPosts, PERIOD_DAYS } from '../firebase/board'

const selectStyle = {
  padding: '11px 10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '12px',
  color: '#555',
  background: '#fff',
  outline: 'none',
}

export default function NoticePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState('전체')
  const [period, setPeriod] = useState('전체')
  const [searchBy, setSearchBy] = useState('제목')
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    return subscribeBoardPosts('notices', setPosts, err => console.error('notices load failed', err))
  }, [])

  const visiblePosts = useMemo(
    () => filterPosts(posts, { category, periodDays: PERIOD_DAYS[period], keyword, searchBy }),
    [posts, category, period, keyword, searchBy],
  )

  return (
    <div className="page-root">
      <Header showBack title="공지사항" />
      <div className="page-scroll">
        <BoardTabs />

        {/* 타이틀 */}
        <div style={{ textAlign: 'center', padding: '36px 20px 28px' }}>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>공지사항</p>
          <p style={{ fontSize: '12px', color: '#999' }}>Bowers &amp; Wilkins Korea에서 안내드립니다.</p>
        </div>

        {/* 카테고리 필터 */}
        <div style={{ padding: '0 20px', marginBottom: '18px' }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ ...selectStyle, width: '100%', padding: '12px 14px', fontSize: '13px' }}
          >
            <option>전체</option>
            <option>공지</option>
            <option>이벤트</option>
            <option>점검</option>
          </select>
        </div>

        {/* 공지 리스트 */}
        <div>
          {visiblePosts.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px 20px', fontSize: '13px', color: '#bbb' }}>
              등록된 공지사항이 없습니다.
            </p>
          )}
          {visiblePosts.map(n => (
            <div
              key={n.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                padding: '15px 20px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
              }}
            >
              <p style={{
                fontSize: '13px', color: '#333', display: 'flex', alignItems: 'baseline', gap: '8px',
                overflow: 'hidden', minWidth: 0,
              }}>
                {n.category && n.category !== '전체' && (
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-accent)', flexShrink: 0 }}>
                    {n.category}
                  </span>
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
              </p>
              <span style={{ fontSize: '11px', color: '#bbb', flexShrink: 0 }}>{n.date.toISOString().slice(0, 10)}</span>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', padding: '28px 0 8px' }}>
          <button style={{ background: 'none', border: 'none', fontSize: '10px', color: '#bbb', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#111', border: '1px solid #111', borderRadius: '4px', padding: '4px 12px' }}>1</span>
          <button style={{ background: 'none', border: 'none', fontSize: '10px', color: '#bbb', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        {/* 검색 + 글쓰기 */}
        <div style={{ padding: '20px 20px 36px', borderTop: '1px solid #f5f5f5', marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <select value={period} onChange={e => setPeriod(e.target.value)} style={selectStyle}>
              <option>일주일</option>
              <option>1개월</option>
              <option>3개월</option>
              <option>전체</option>
            </select>
            <select value={searchBy} onChange={e => setSearchBy(e.target.value)} style={selectStyle}>
              <option>제목</option>
              <option>내용</option>
            </select>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="검색어를 입력해주세요"
              style={{
                flex: 1, minWidth: 0, padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px',
                fontSize: '12px', outline: 'none',
              }}
            />
          </div>
          <button
            onClick={() => navigate(user ? '/notice/write' : '/login')}
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
