import Header from '../components/Header'
import Footer from '../components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTicket } from '@fortawesome/free-solid-svg-icons'

const COUPONS = [
  { id: 1, title: '신규 회원가입 쿠폰', amount: '3,000원', condition: '3만원 이상 구매 시', expires: '2026-08-31', usable: true },
  { id: 2, title: '여름 프로모션 10% 할인', amount: '10%', condition: '프로모션 상품 한정', expires: '2026-07-31', usable: true },
  { id: 3, title: '무료배송 쿠폰', amount: '배송비 무료', condition: '금액 제한 없음', expires: '2026-07-15', usable: true },
  { id: 4, title: '첫 구매 감사 쿠폰', amount: '5,000원', condition: '사용 완료', expires: '2026-06-20', usable: false },
]

export default function CouponsPage() {
  const usableCount = COUPONS.filter(c => c.usable).length

  return (
    <div className="page-root">
      <Header showBack title="쿠폰" />
      <div className="page-scroll">
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '14px' }}>
            사용 가능한 쿠폰 <b style={{ color: 'var(--c-accent)' }}>{usableCount}장</b>
          </p>

          {COUPONS.map(coupon => (
            <div key={coupon.id} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '10px', padding: '16px',
              opacity: coupon.usable ? 1 : 0.45,
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                background: coupon.usable ? 'var(--gradient-brand, #094089)' : '#ccc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FontAwesomeIcon icon={faTicket} style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>{coupon.amount}</p>
                <p style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{coupon.title}</p>
                <p style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>{coupon.condition} · ~{coupon.expires}</p>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: '600', flexShrink: 0,
                color: coupon.usable ? 'var(--c-accent)' : '#aaa',
              }}>
                {coupon.usable ? '사용가능' : '만료/사용'}
              </span>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  )
}
