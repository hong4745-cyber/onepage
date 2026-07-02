import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="page-root">
      <Header showBack />
      <div className="page-scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎧</div>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
            페이지를 찾을 수 없습니다
          </p>
          <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6', marginBottom: '32px' }}>
            요청하신 페이지가 존재하지 않거나<br />주소가 잘못되었습니다.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 32px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              letterSpacing: '0.3px',
            }}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  )
}
