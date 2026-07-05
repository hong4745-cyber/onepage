import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import logoImg from '../assets/images/0_logo.png'
import { useAuth } from '../context/AuthContext'

function signupErrorMessage(err) {
  console.error('[signup]', err)
  switch (err.code) {
    case 'auth/email-already-in-use': return '이미 가입된 이메일입니다.'
    case 'auth/invalid-email': return '이메일 형식이 올바르지 않습니다.'
    case 'auth/weak-password': return '비밀번호는 6자 이상이어야 합니다.'
    case 'auth/popup-closed-by-user': return '로그인 창이 닫혔습니다. 다시 시도해주세요.'
    case 'auth/unauthorized-domain': return `이 도메인은 Firebase에 승인되지 않았습니다. (${window.location.hostname})`
    case 'auth/operation-not-allowed': return 'Google 로그인이 아직 활성화되지 않았습니다.'
    default: return `회원가입에 실패했습니다. (${err.code || err.message})`
  }
}

export default function SignupPopup({ onClose, onLoginClick }) {
  const { signup, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPwC, setShowPwC] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const pwMatch = pw === pwConfirm

  async function handleSubmit(e) {
    e.preventDefault()
    if (!pwMatch || !agree) return
    setError('')
    setSubmitting(true)
    try {
      await signup(email, pw)
      onClose()
    } catch (err) {
      setError(signupErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleSignup() {
    setError('')
    try {
      await loginWithGoogle()
      onClose()
    } catch (err) {
      setError(signupErrorMessage(err))
    }
  }

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 700 }}
      />

      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: '380px',
        background: '#fff', borderRadius: '16px',
        padding: '32px 28px 28px', zIndex: 701,
        boxSizing: 'border-box',
      }}>
        {/* 닫기 */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '14px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <FontAwesomeIcon icon={faXmark} style={{ fontSize: '18px', color: '#aaa' }} />
        </button>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={logoImg} alt="Bowers & Wilkins" style={{ height: '18px', objectFit: 'contain' }} />
          <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>회원가입</p>
        </div>

        {/* 구글 버튼 */}
        <button type="button" onClick={handleGoogleSignup} style={{
          width: '100%', padding: '12px', borderRadius: '10px',
          border: '1.5px solid #e0e0e0', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          fontSize: '14px', fontWeight: '600', color: '#333', cursor: 'pointer',
          marginBottom: '20px',
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.2 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.5l7 5.4C12.4 13.6 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 7.2-16.9z"/>
            <path fill="#FBBC05" d="M10.7 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7-5.4A23.9 23.9 0 0 0 .1 24c0 3.9.9 7.5 2.6 10.8l8-6.2z"/>
            <path fill="#34A853" d="M24 47c5.6 0 10.3-1.8 13.7-5L30.3 36c-1.9 1.3-4.4 2-6.3 2-6.3 0-11.6-4.2-13.5-10l-8 6.2C6.7 41.5 14.8 47 24 47z"/>
          </svg>
          Google로 가입
        </button>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: '#ebebeb' }} />
          <span style={{ fontSize: '12px', color: '#bbb' }}>또는</span>
          <div style={{ flex: 1, height: '1px', background: '#ebebeb' }} />
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 이메일 */}
          <div style={{ marginBottom: '12px' }}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* 비밀번호 */}
          <div style={{ marginBottom: '12px', position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '40px' }}
            />
            <button type="button" onClick={() => setShowPw(v => !v)} style={eyeBtn}>
              <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} style={{ fontSize: '14px', color: '#aaa' }} />
            </button>
          </div>

          {/* 비밀번호 확인 */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <input
              type={showPwC ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={pwConfirm}
              onChange={e => setPwConfirm(e.target.value)}
              required
              style={{
                ...inputStyle,
                paddingRight: '40px',
                borderColor: pwConfirm && !pwMatch ? '#e03131' : undefined,
              }}
            />
            <button type="button" onClick={() => setShowPwC(v => !v)} style={eyeBtn}>
              <FontAwesomeIcon icon={showPwC ? faEyeSlash : faEye} style={{ fontSize: '14px', color: '#aaa' }} />
            </button>
            {pwConfirm && !pwMatch && (
              <p style={{ fontSize: '11px', color: '#e03131', marginTop: '4px' }}>비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {/* 약관 동의 */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              style={{ width: '15px', height: '15px', accentColor: 'var(--c-accent)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', color: '#666' }}>
              <span style={{ color: 'var(--c-accent)', textDecoration: 'underline', cursor: 'pointer' }}>이용약관</span> 및{' '}
              <span style={{ color: 'var(--c-accent)', textDecoration: 'underline', cursor: 'pointer' }}>개인정보처리방침</span>에 동의합니다.
            </span>
          </label>

          {error && (
            <p style={{ fontSize: '12px', color: '#e03131', marginBottom: '12px' }}>{error}</p>
          )}

          {/* 가입 버튼 */}
          <button
            type="submit"
            disabled={!agree || !pwMatch || submitting}
            style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              background: agree && pwMatch ? 'var(--c-accent)' : '#ccc',
              color: '#fff', border: 'none',
              fontSize: '14px', fontWeight: '700',
              cursor: agree && pwMatch && !submitting ? 'pointer' : 'default',
              opacity: submitting ? 0.6 : 1,
              transition: 'background 0.2s',
            }}
          >
            {submitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        {/* 로그인 링크 */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '18px' }}>
          이미 회원이신가요?{' '}
          <span
            onClick={onLoginClick}
            style={{ color: 'var(--c-accent)', fontWeight: '600', cursor: 'pointer' }}
          >
            로그인
          </span>
        </p>
      </div>
    </>,
    document.body
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '9px',
  border: '1.5px solid #e0e0e0', fontSize: '14px', color: '#111',
  outline: 'none', boxSizing: 'border-box', background: '#fafafa',
}

const eyeBtn = {
  position: 'absolute', top: '50%', right: '12px',
  transform: 'translateY(-50%)', background: 'none',
  border: 'none', cursor: 'pointer', padding: '4px',
}
