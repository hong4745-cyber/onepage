import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faGift } from '@fortawesome/free-solid-svg-icons'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#fff' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px 8px 4px 0', color: '#111' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>로그인</span>
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

        {/* 로고 + 브랜드 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '8px',
            background: '#111',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ color: '#fff', fontSize: '22px', fontWeight: '800', letterSpacing: '-1px' }}>B&W</span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '6px' }}>Bowers &amp; Wilkins</h1>
          <p style={{ fontSize: '13px', color: '#888' }}>로그인하고 3,000원 쿠폰을 받아보세요</p>
        </div>

        {/* 쿠폰 배너 */}
        <div style={{
          width: '100%', maxWidth: '360px',
          background: '#111',
          borderRadius: '6px', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '32px',
        }}>
          <FontAwesomeIcon icon={faGift} style={{ fontSize: '28px', color: '#fff' }} />
          <div>
            <p style={{ color: '#fff', fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>신규 회원가입 혜택</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>즉시 사용 가능한 3,000원 쿠폰 증정</p>
          </div>
        </div>

        {/* Google 로그인 버튼 */}
        <button
          onClick={() => alert('Google 로그인 연동 준비 중입니다.')}
          style={{
            width: '100%', maxWidth: '360px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            padding: '14px 20px', borderRadius: '6px',
            border: '1px solid #e0e0e0', background: '#fff',
            fontSize: '15px', fontWeight: '600', color: '#111',
            cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          {/* Google 아이콘 */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.5C9.9 35.7 16.5 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.6l6.2 5.2C36.9 36.2 44 31 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          Google로 계속하기
        </button>

        <p style={{ marginTop: '24px', fontSize: '11px', color: '#bbb', textAlign: 'center', lineHeight: 1.6 }}>
          계속 진행하면 <span style={{ textDecoration: 'underline' }}>이용약관</span> 및{' '}
          <span style={{ textDecoration: 'underline' }}>개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  )
}
