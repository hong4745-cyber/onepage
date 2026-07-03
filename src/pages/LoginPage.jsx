import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const inputStyle = {
  width: '100%', padding: '14px 16px',
  border: '1px solid #ddd', borderRadius: '6px',
  fontSize: '14px', color: '#111', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [autoLogin, setAutoLogin] = useState(false)
  const [error, setError] = useState('')

  function saveSession(user) {
    const storage = autoLogin ? localStorage : sessionStorage
    storage.setItem('bw_user', JSON.stringify(user))
  }

  function handleLogin(e) {
    e.preventDefault()
    if (!userId.trim()) { setError('아이디(이메일)를 입력해주세요.'); return }
    if (!password) { setError('비밀번호를 입력해주세요.'); return }
    if (password.length < 4) { setError('비밀번호는 4자 이상이어야 합니다.'); return }
    setError('')
    saveSession({ id: userId.trim(), provider: 'email' })
    navigate('/')
  }

  function handleGoogleLogin() {
    // 실제 서비스 연동 전까지는 데모 계정으로 로그인 처리
    saveSession({ id: 'google_user@gmail.com', provider: 'google' })
    navigate('/')
  }

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 24px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>

          {/* 타이틀 */}
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '6px' }}>로그인</h1>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>
            간편하게 로그인하고 다양한 혜택을 만나보세요.
          </p>

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="아이디 (이메일)"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ fontSize: '12px', color: '#e03131', marginBottom: '10px' }}>{error}</p>
            )}

            {/* 자동로그인 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555', marginBottom: '16px', cursor: 'pointer', width: 'fit-content' }}>
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={e => setAutoLogin(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#111', cursor: 'pointer' }}
              />
              자동로그인
            </label>

            <button
              type="submit"
              style={{
                width: '100%', padding: '15px', borderRadius: '6px',
                background: '#111', color: '#fff', border: 'none',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              로그인
            </button>
          </form>

          {/* 찾기 / 회원가입 링크 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '18px 0 28px' }}>
            {[
              ['아이디 찾기', () => alert('아이디 찾기 준비 중입니다.')],
              ['비밀번호 찾기', () => alert('비밀번호 찾기 준비 중입니다.')],
              ['회원가입', () => navigate('/signup')],
            ].map(([label, onClick], i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {i > 0 && <span style={{ width: '1px', height: '11px', background: '#ddd' }} />}
                <button
                  onClick={onClick}
                  style={{ background: 'none', border: 'none', fontSize: '13px', color: '#555', cursor: 'pointer', padding: 0 }}
                >
                  {label}
                </button>
              </span>
            ))}
          </div>

          {/* 구분선 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            <span style={{ fontSize: '12px', color: '#aaa' }}>간편 로그인</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          </div>

          {/* Google 로그인 */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '14px 20px', borderRadius: '6px',
              border: '1px solid #e0e0e0', background: '#fff',
              fontSize: '14px', fontWeight: '600', color: '#111',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.5C9.9 35.7 16.5 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.5 5.6l6.2 5.2C36.9 36.2 44 31 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Google로 로그인
          </button>

          <p style={{ marginTop: '24px', fontSize: '11px', color: '#bbb', textAlign: 'center', lineHeight: 1.6 }}>
            계속 진행하면 <span style={{ textDecoration: 'underline' }}>이용약관</span> 및{' '}
            <span style={{ textDecoration: 'underline' }}>개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
