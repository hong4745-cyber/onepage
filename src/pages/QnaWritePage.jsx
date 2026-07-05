import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { addBoardPost } from '../firebase/board'

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '4px',
  fontSize: '14px', color: '#111', outline: 'none', boxSizing: 'border-box',
}

export default function QnaWritePage() {
  const navigate = useNavigate()
  const { user, authReady } = useAuth()
  const [category, setCategory] = useState('배송')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [secret, setSecret] = useState(false)
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
      await addBoardPost('qna', { category, title: title.trim(), content: content.trim(), secret }, user)
      navigate('/qna')
    } catch {
      setError('등록에 실패했습니다. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page-root">
      <Header showBack title="상품문의 글쓰기" />
      <div className="page-scroll">
        <form onSubmit={handleSubmit} style={{ padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option>배송</option>
            <option>제품</option>
            <option>교환/반품</option>
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
            placeholder="문의하실 내용을 입력해주세요"
            rows={10}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', cursor: 'pointer', width: 'fit-content' }}>
            <input
              type="checkbox"
              checked={secret}
              onChange={e => setSecret(e.target.checked)}
              style={{ width: '15px', height: '15px', cursor: 'pointer' }}
            />
            비밀글로 작성 (작성자만 내용 확인 가능)
          </label>

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
