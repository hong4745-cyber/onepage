import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { addBoardPost } from '../firebase/board'
import products from '../products.json'

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '4px',
  fontSize: '14px', color: '#111', outline: 'none', boxSizing: 'border-box',
}

export default function ReviewWritePage() {
  const navigate = useNavigate()
  const { user, authReady } = useAuth()
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authReady && !user) navigate('/login')
  }, [authReady, user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) { setError('리뷰 내용을 입력해주세요.'); return }
    const product = products.find(p => p.id === Number(productId))
    if (!product) { setError('상품을 선택해주세요.'); return }
    setError('')
    setSubmitting(true)
    try {
      await addBoardPost('reviews', {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        rating,
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
      }, user)
      navigate('/reviews')
    } catch {
      setError('등록에 실패했습니다. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page-root">
      <Header showBack title="리뷰 작성" />
      <div className="page-scroll">
        <form onSubmit={handleSubmit} style={{ padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select value={productId} onChange={e => setProductId(e.target.value)} style={inputStyle}>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <FontAwesomeIcon icon={faStar} style={{ color: value <= rating ? '#f5a623' : '#e8e8e8', fontSize: '20px' }} />
                </button>
              )
            })}
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="상품에 대한 솔직한 후기를 남겨주세요"
            rows={8}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />

          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="사진 URL (선택, 포토리뷰로 등록됩니다)"
            style={inputStyle}
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
