import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft, faAnglesRight, faLock, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BoardTabs from '../components/BoardTabs'

const PINNED = { title: '오배송&불량 안내사항', date: '2026-06-18', views: 53, author: '홍****' }

const QNA_LIST = [
  { title: '배송 소요 시간은 얼마나 걸리나요?', secret: true, date: '2026-06-04', views: 119, author: 'B&W' },
  { title: '제품 배터리', secret: true, date: '2026-06-04', views: 53, author: 'B&W' },
  { title: '배송 일정 문의', secret: true, date: '2026-06-04', views: 53, author: 'B&W' },
]

export default function QnaPage() {
  const [category, setCategory] = useState('전체')

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

          {QNA_LIST.map((q, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
              <p style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                {q.title}
                {q.secret && <FontAwesomeIcon icon={faLock} style={{ color: '#bbb', fontSize: '10px' }} />}
              </p>
              <p style={{ fontSize: '11px', color: '#bbb' }}>
                {q.date}&nbsp;&nbsp;조회 {q.views}&nbsp;&nbsp;{q.author}
              </p>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div style={{ padding: '40px 20px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#111', border: '1px solid #111', borderRadius: '4px', padding: '6px 14px' }}>1</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '13px', color: '#bbb', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <button style={{ background: 'none', border: 'none', fontSize: '13px', color: '#bbb', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
