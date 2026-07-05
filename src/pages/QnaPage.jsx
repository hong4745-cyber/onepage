import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BoardTabs from '../components/BoardTabs'
import { useAuth } from '../context/AuthContext'
import { subscribeBoardPosts, filterPosts } from '../firebase/board'

const PINNED = { title: '오배송&불량 안내사항', date: '2026-06-18', views: 53, author: '홍****' }

export default function QnaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState('전체')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    return subscribeBoardPosts('qna', setPosts, err => console.error('qna load failed', err))
  }, [])

  const visiblePosts = useMemo(() => filterPosts(posts, { category }), [posts, category])

  function canViewContent(q) {
    return !q.secret || (user && user.uid === q.authorId)
  }

  return (
    <div className="page-root">
      <Header showBack title="상품문의" />
      <div className="page-scroll">
        <BoardTabs />

        {/* 타이틀 */}
        <div style={{ textAlign: 'center', padding: '36px 20px 28px' }}>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>상품문의</p>
          <p style={{ fontSize: '12px', color: '#999' }}>상품문의 게시판 입니다.</p>
        </div>

        {/* 카테고리 필터 */}
        <div style={{ padding: '0 20px', marginBottom: '18px' }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '4px',
              fontSize: '13px', color: '#333', background: '#fff', outline: 'none',
            }}
          >
            <option>전체</option>
            <option>배송</option>
            <option>제품</option>
            <option>교환/반품</option>
          </select>
        </div>

        {/* 문의 리스트 */}
        <div>
          {/* 상단 고정 안내글 */}
          <div style={{ padding: '14px 20px', background: '#f5f5f5', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
              <FontAwesomeIcon icon={faThumbtack} style={{ color: '#aaa', fontSize: '11px' }} />
              {PINNED.title}
            </p>
            <p style={{ fontSize: '11px', color: '#bbb' }}>
              {PINNED.date}&nbsp;&nbsp;조회 {PINNED.views}&nbsp;&nbsp;{PINNED.author}
            </p>
          </div>

          {visiblePosts.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px 20px', fontSize: '13px', color: '#bbb' }}>
              등록된 문의가 없습니다.
            </p>
          )}

          {visiblePosts.map(q => {
            const expanded = expandedId === q.id
            const viewable = canViewContent(q)
            return (
              <div key={q.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <div
                  onClick={() => setExpandedId(expanded ? null : q.id)}
                  style={{ padding: '14px 20px', cursor: 'pointer' }}
                >
                  <p style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {q.title}
                    {q.secret && <FontAwesomeIcon icon={faLock} style={{ color: '#bbb', fontSize: '10px' }} />}
                  </p>
                  <p style={{ fontSize: '11px', color: '#bbb' }}>
                    {q.date.toISOString().slice(0, 10)}&nbsp;&nbsp;{q.authorEmail}
                  </p>
                </div>
                {expanded && (
                  <div style={{ padding: '0 20px 16px', fontSize: '12px', color: viewable ? '#555' : '#bbb', lineHeight: 1.6 }}>
                    {viewable ? q.content : '비밀글입니다. 작성자만 확인할 수 있습니다.'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 페이지네이션 + 글쓰기 */}
        <div style={{ padding: '40px 20px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#111', border: '1px solid #111', borderRadius: '4px', padding: '6px 14px' }}>1</span>
          </div>
          <button
            onClick={() => navigate(user ? '/qna/write' : '/login')}
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
