import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BoardTabs from '../components/BoardTabs'

export default function EmptyPage({ title = '준비 중입니다', boardTabs = false }) {
  const navigate = useNavigate()

  return (
    <div className="page-root">
      <Header showBack title={title} />
      <div
        className="page-scroll"
        style={boardTabs ? {} : { display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {boardTabs && <BoardTabs />}
        <div style={{ textAlign: 'center', padding: boardTabs ? '120px 24px 140px' : '40px 24px' }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎵</div>
          <p style={{ fontSize: '17px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
            {title}
          </p>
          <p
            style={{
              fontSize: '13px',
              color: '#888',
              lineHeight: '1.8',
              marginBottom: '32px',
            }}
          >
            해당 페이지는 현재 준비 중입니다.<br />
            더 좋은 서비스로 곧 찾아뵙겠습니다.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 36px',
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
