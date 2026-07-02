import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterChipsBar from '../components/FilterChipsBar'

export default function OrderCompletePage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  if (!state?.orderNum) {
    navigate('/', { replace: true })
    return null
  }

  const { orderNum, totalPrice, itemCount } = state

  return (
    <div className="page-root">
      <Header title="주문 완료" />

      <div className="page-scroll">
        <FilterChipsBar />
        {/* 완료 아이콘 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '52px 20px 36px' }}>
          <FontAwesomeIcon
            icon={faCircleCheck}
            style={{ fontSize: '72px', color: '#094089', marginBottom: '20px' }}
          />
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
            주문이 완료되었습니다
          </h1>
          <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', lineHeight: '1.6' }}>
            주문이 정상적으로 접수되었습니다.<br />빠르게 배송 준비 해드리겠습니다.
          </p>
        </div>

        {/* 주문 정보 */}
        <div style={{ background: '#f8f9ff', margin: '0 16px', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#094089', marginBottom: '14px' }}>주문 정보</h2>
          {[
            ['주문 번호', orderNum],
            ['주문 수량', `${itemCount}개`],
            ['결제 금액', `${totalPrice?.toLocaleString()}원`],
            ['배송 예정', '결제 후 2~3 영업일'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 안내 */}
        <div style={{ margin: '20px 16px', padding: '16px', border: '1px solid #ebebeb', borderRadius: '10px' }}>
          <p style={{ fontSize: '12px', color: '#999', lineHeight: '1.8' }}>
            • 주문 확인 후 SMS 또는 이메일로 안내드립니다.<br />
            • 배송 조회는 마이페이지에서 확인하실 수 있습니다.<br />
            • 문의사항은 고객센터 1588-0000으로 연락해 주세요.
          </p>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '10px', padding: '8px 16px 32px' }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              flex: 1, padding: '14px', borderRadius: '10px',
              border: '1px solid #ddd', background: '#fff',
              color: '#555', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            쇼핑 계속하기
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              flex: 1, padding: '14px', borderRadius: '10px',
              background: '#111', color: '#fff',
              border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            홈으로
          </button>
        </div>

        <Footer />
      </div>
    </div>
  )
}
