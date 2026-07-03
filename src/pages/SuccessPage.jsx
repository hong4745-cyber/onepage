import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { getCheckout } from '../utils/polar'

// KRW 등 소수점 없는 통화는 최소 단위 변환(÷100) 없이 그대로 표시
const ZERO_DECIMAL = ['krw', 'jpy', 'vnd']
function formatAmount(amount, currency = 'usd') {
  if (amount == null) return '-'
  const value = ZERO_DECIMAL.includes(currency.toLowerCase()) ? amount : amount / 100
  if (currency.toLowerCase() === 'krw') return `${value.toLocaleString()}원`
  return `${value.toLocaleString()} ${currency.toUpperCase()}`
}

export default function SuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const checkoutId = searchParams.get('checkout_id')
  const { clearCart } = useCart()

  const [state, setState] = useState({ loading: true, checkout: null, error: '' })

  useEffect(() => {
    if (!checkoutId) {
      setState({ loading: false, checkout: null, error: '결제 정보가 없습니다.' })
      return
    }
    getCheckout(checkoutId)
      .then(checkout => {
        setState({ loading: false, checkout, error: '' })
        if (checkout.status === 'succeeded' || checkout.status === 'confirmed') {
          clearCart()
        }
      })
      .catch(err => setState({ loading: false, checkout: null, error: err.message }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId])

  const { loading, checkout, error } = state
  const paid = checkout && (checkout.status === 'succeeded' || checkout.status === 'confirmed')

  return (
    <div className="page-root">
      <Header showBack title="결제 완료" />
      <div className="page-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 24px 48px', textAlign: 'center' }}>

          {loading && (
            <p style={{ fontSize: '14px', color: '#888' }}>결제 결과를 확인하고 있습니다...</p>
          )}

          {!loading && paid && (
            <>
              <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '56px', color: '#094089', marginBottom: '20px' }} />
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>결제가 완료되었습니다</h1>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>
                주문해 주셔서 감사합니다.<br />결제 내역은 이메일로 발송됩니다.
              </p>

              <div style={{ width: '100%', maxWidth: '360px', border: '1px solid #ebebeb', borderRadius: '10px', padding: '18px', marginBottom: '32px', textAlign: 'left' }}>
                {[
                  ['주문번호', checkout.id.slice(0, 8).toUpperCase()],
                  ['상품', checkout.product?.name?.replace(/^\(Bowers\s*&\s*Wilkins\)\s*/, '') ?? '-'],
                  ['결제금액', formatAmount(checkout.total_amount, checkout.currency)],
                  ['결제상태', '결제 완료'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>{k}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !paid && !error && (
            <>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: '56px', color: '#f59e0b', marginBottom: '20px' }} />
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>결제가 아직 완료되지 않았습니다</h1>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>
                결제 상태: {checkout?.status ?? '알 수 없음'}<br />
                결제 창을 닫으셨다면 다시 시도해 주세요.
              </p>
            </>
          )}

          {!loading && error && (
            <>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: '56px', color: '#e03131', marginBottom: '20px' }} />
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>결제 결과를 확인할 수 없습니다</h1>
              <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '28px' }}>{error}</p>
            </>
          )}

          {!loading && (
            <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '360px' }}>
              <button
                onClick={() => navigate('/products')}
                style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #111', background: '#fff', color: '#111', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                쇼핑 계속하기
              </button>
              <button
                onClick={() => navigate('/')}
                style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#111', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                홈으로
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  )
}
