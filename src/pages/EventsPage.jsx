import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BoardTabs from '../components/BoardTabs'
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

function eventStatus(event) {
  if (!event.startDate || !event.endDate) return null
  const today = new Date().toISOString().slice(0, 10)
  if (today < event.startDate) return { label: '예정', color: '#888' }
  if (today > event.endDate) return { label: '종료', color: '#bbb' }
  return { label: '진행중', color: 'var(--c-accent)' }
}

export default function EventsPage() {
  const [posts, setPosts] = useState([])
  const [period, setPeriod] = useState('전체')
  const [searchBy, setSearchBy] = useState('제목')
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    return subscribeBoardPosts('events', setPosts, err => console.error('events load failed', err))
  }, [])

  const visiblePosts = useMemo(
    () => filterPosts(posts, { periodDays: PERIOD_DAYS[period], keyword, searchBy }),
    [posts, period, keyword, searchBy],
  )

  return (
    <div className="page-root">
      <Header showBack title="이벤트" />
      <div className="page-scroll">
        <BoardTabs />

        {/* 타이틀 */}
        <div style={{ textAlign: 'center', padding: '36px 20px 28px' }}>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>이벤트</p>
          <p style={{ fontSize: '12px', color: '#999' }}>Bowers &amp; Wilkins Korea의 다양한 이벤트를 만나보세요.</p>
        </div>

        {/* 이벤트 리스트 */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {visiblePosts.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px 0', fontSize: '13px', color: '#bbb' }}>
              진행 중인 이벤트가 없습니다.
            </p>
          )}
          {visiblePosts.map(ev => {
            const status = eventStatus(ev)
            return (
              <div
                key={ev.id}
                style={{
                  border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                }}
              >
                {ev.imageUrl && (
                  <div style={{ aspectRatio: '16/9', background: '#f7f7f7' }}>
                    <img src={ev.imageUrl} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                )}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    {status && (
                      <span style={{ fontSize: '11px', fontWeight: '700', color: status.color }}>{status.label}</span>
                    )}
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{ev.title}</span>
                  </div>
                  {(ev.startDate || ev.endDate) && (
                    <p style={{ fontSize: '11px', color: '#bbb', marginBottom: '4px' }}>
                      {ev.startDate} ~ {ev.endDate}
                    </p>
                  )}
                  <p style={{
                    fontSize: '12px', color: '#888', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{ev.content}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* 검색 */}
        <div style={{ padding: '20px 20px 36px', borderTop: '1px solid #f5f5f5', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
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
        </div>

        <Footer />
      </div>
    </div>
  )
}
