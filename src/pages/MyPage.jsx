import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ORDER_STATUS = [
  { label: '입금전',    count: 0 },
  { label: '결제완료',  count: 1 },
  { label: '배송준비중', count: 0 },
  { label: '배송중',   count: 1 },
  { label: '배송완료',  count: 3 },
]

const CANCEL_STATUS = [
  { label: '취소',  count: 0 },
  { label: '반품',  count: 1 },
  { label: '교환',  count: 0 },
]

const MY_MENU = [
  { label: '주문내역 상세', desc: '주문·배송 상태 확인', path: '/orders' },
  { label: '관심상품', desc: '찜한 상품 모아보기', path: '/wishlist' },
  { label: '나의 리뷰', desc: '작성한 리뷰 관리', path: '/reviews' },
  { label: '쿠폰', desc: '보유 쿠폰 확인', path: '/coupons' },
]

export default function MyPage() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingBottom: '80px' }}>
      <Header showBack title="나의쇼핑" />

      <div style={{ padding: '16px 16px 0' }}>

        {/* 주문 현황 */}
        <section style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>3개월간 주문 현황</span>
            <span style={moreStyle} onClick={() => navigate('/orders')}>전체보기 &rsaquo;</span>
          </div>

          <div style={{ display: 'flex', borderTop: '1px solid #f0f0f0', marginTop: '12px' }}>
            {ORDER_STATUS.map((s, i) => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center', padding: '16px 0',
                position: 'relative',
              }}>
                <p style={{ fontSize: '18px', fontWeight: '700', color: s.count > 0 ? 'var(--c-accent)' : '#111', marginBottom: '6px' }}>
                  {s.count}
                </p>
                <p style={{ fontSize: '10px', color: '#999', lineHeight: 1.3 }}>{s.label}</p>

                {/* 화살표 */}
                {i < ORDER_STATUS.length - 1 && (
                  <span style={{
                    position: 'absolute', right: '-4px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '10px', color: '#ccc', zIndex: 1,
                  }}>›</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 취소·반품 내역 */}
        <section style={{ ...cardStyle, marginTop: '10px' }}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>3개월간 취소·반품 내역</span>
            <span style={moreStyle} onClick={() => navigate('/orders')}>전체보기 &rsaquo;</span>
          </div>

          <div style={{ display: 'flex', borderTop: '1px solid #f0f0f0', marginTop: '12px' }}>
            {CANCEL_STATUS.map(s => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center', padding: '16px 0',
              }}>
                <p style={{ fontSize: '18px', fontWeight: '700', color: s.count > 0 ? '#e03131' : '#111', marginBottom: '6px' }}>
                  {s.count}
                </p>
                <p style={{ fontSize: '10px', color: '#999' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 마이 메뉴 */}
        <section style={{ ...cardStyle, marginTop: '10px', padding: 0, overflow: 'hidden' }}>
          {MY_MENU.map((item, i, arr) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '15px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
                cursor: 'pointer',
              }}
            >
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>{item.label}</p>
                <p style={{ fontSize: '11px', color: '#bbb' }}>{item.desc}</p>
              </div>
              <span style={{ fontSize: '16px', color: '#ccc' }}>›</span>
            </div>
          ))}
        </section>

      </div>

      <Footer />
    </div>
  )
}

const cardStyle = {
  background: '#fff', borderRadius: '12px',
  border: '1px solid #f0f0f0', padding: '16px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

const cardHeaderStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}

const cardTitleStyle = {
  fontSize: '13px', fontWeight: '700', color: '#111',
}

const moreStyle = {
  fontSize: '11px', color: '#bbb', cursor: 'pointer',
}
