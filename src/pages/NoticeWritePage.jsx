import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { addBoardPost } from '../firebase/board'

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '4px',
  fontSize: '14px', color: '#111', outline: 'none', boxSizing: 'border-box',
}

export default function NoticeWritePage() {
  const navigate = useNavigate()
  const { user, authReady } = useAuth()
  const [category, setCategory] = useState('공지')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authReady && !user) navigate('/login')
  }, [authReady, user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('제목과 내용을 입력해주세요.'); return }
    setError('')
    setSubmitting(true)
    try {
      await addBoardPost('notices', { category, title: title.trim(), content: content.trim() }, user)
      navigate('/notice')
    } catch {
      setError('등록에 실패했습니다. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page-root">
      <Header showBack title="공지사항 글쓰기" />
      <div className="page-scroll">
        <form onSubmit={handleSubmit} style={{ padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option>공지</option>
            <option>이벤트</option>
            <option>점검</option>
          </select>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목"
            style={inputStyle}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
            rows={12}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
          {error && <p style={{ fontSize: '12px', color: '#e03131' }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', padding: '14px 0', marginTop: '8px',
              background: '#111', color: '#fff', border: 'none', borderRadius: '6px',
              fontSize: '14px', fontWeight: '600', cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
