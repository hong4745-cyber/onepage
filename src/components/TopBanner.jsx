import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGift } from '@fortawesome/free-solid-svg-icons'

export default function TopBanner() {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate('/login')}
      style={{
        background: 'var(--gradient-brand)',
        padding: '7px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <span style={{ color: '#fff', fontSize: '12px', fontWeight: '500', letterSpacing: '0.2px' }}>
        <FontAwesomeIcon icon={faGift} style={{ marginRight: '6px' }} />
        지금 회원가입시 3,000원 쿠폰 바로 증정!
      </span>
    </div>
  )
}
