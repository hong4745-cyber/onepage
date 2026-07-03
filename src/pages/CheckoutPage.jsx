import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import { useCart } from '../context/CartContext'
import { resolveImage } from '../utils/imageMap'
import { findPolarProduct, createCheckout } from '../utils/polar'

const PAYMENT_METHODS = [
  { id: 'card',    label: '신용/체크카드' },
  { id: 'kakao',  label: '카카오페이' },
  { id: 'naver',  label: '네이버페이' },
  { id: 'bank',   label: '무통장입금' },
]

const DELIVERY_MEMOS = ['부재시 문 앞에 놓아주세요', '배송 전 연락 부탁드립니다', '경비실에 맡겨주세요', '직접 입력']

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', marginBottom: '8px', padding: '20px 16px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '16px' }}>{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '12px', color: '#888', marginBottom: '6px', display: 'block' }}>
        {label}{required && <span style={{ color: '#e03131', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = (err) => ({
  width: '100%', padding: '11px 12px', borderRadius: '8px', fontSize: '14px',
  border: `1px solid ${err ? '#e03131' : '#e0e0e0'}`, outline: 'none',
  color: '#111', boxSizing: 'border-box', background: '#fff',
})

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, totalPrice } = useCart()

  const [form, setForm] = useState({ name: '', phone: '', address: '', addressDetail: '', memo: DELIVERY_MEMOS[0], memoCustom: '' })
  const [payment, setPayment] = useState('card')
  const [errors, setErrors] = useState({})
  const [orderOpen, setOrderOpen] = useState(false)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  if (cart.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = '이름을 입력해 주세요'
    if (!form.phone.trim())   e.phone   = '연락처를 입력해 주세요'
    if (!form.address.trim()) e.address = '주소를 입력해 주세요'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setPaying(true)
    setPayError('')
    try {
      // 장바구니 상품을 Polar 상품과 이름으로 매칭 (Polar API 실시간 조회)
      const matches = await Promise.all(cart.map(item => findPolarProduct(item.name)))
      const productIds = [...new Set(matches.filter(Boolean).map(m => m.id))]

      if (productIds.length === 0) {
        setPayError('결제 가능한 상품이 없습니다. (Polar에 등록되지 않은 상품)')
        return
      }

      const unmatched = cart.filter((_, i) => !matches[i])
      if (unmatched.length > 0) {
        setPayError(`일부 상품은 아직 결제 등록 전입니다: ${unmatched.map(u => u.name).join(', ')}`)
        return
      }

      const checkout = await createCheckout(productIds, {
        buyer_name: form.name,
        buyer_phone: form.phone,
        address: `${form.address} ${form.addressDetail}`.trim(),
      })
      // Polar 결제 페이지로 이동 (결제 완료 시 /success로 복귀)
      window.location.href = checkout.url
    } catch (err) {
      setPayError(err.message || '결제 페이지 연결에 실패했습니다.')
    } finally {
      setPaying(false)
    }
  }

  const deliveryFee = totalPrice >= 100000 ? 0 : 3000
  const finalPrice  = totalPrice + deliveryFee

  return (
    <div className="page-root">
      <Header showBack title="결제" />

      <div className="page-scroll" style={{ background: '#f5f5f5' }}>

        {/* 주문자 정보 */}
        <Section title="주문자 정보">
          <Field label="이름" required>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="홍길동" style={inputStyle(errors.name)} />
            {errors.name && <p style={{ fontSize: '11px', color: '#e03131', marginTop: '4px' }}>{errors.name}</p>}
          </Field>
          <Field label="연락처" required>
            <input value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="010-0000-0000" type="tel" style={inputStyle(errors.phone)} />
            {errors.phone && <p style={{ fontSize: '11px', color: '#e03131', marginTop: '4px' }}>{errors.phone}</p>}
          </Field>
        </Section>

        {/* 배송지 */}
        <Section title="배송지">
          <Field label="주소" required>
            <input value={form.address} onChange={e => set('address', e.target.value)}
              placeholder="도로명 또는 지번 주소" style={inputStyle(errors.address)} />
            {errors.address && <p style={{ fontSize: '11px', color: '#e03131', marginTop: '4px' }}>{errors.address}</p>}
          </Field>
          <Field label="상세주소">
            <input value={form.addressDetail} onChange={e => set('addressDetail', e.target.value)}
              placeholder="동, 호수 등" style={inputStyle(false)} />
          </Field>
          <Field label="배송메모">
            <select
              value={form.memo}
              onChange={e => set('memo', e.target.value)}
              style={{ ...inputStyle(false), appearance: 'none', cursor: 'pointer' }}
            >
              {DELIVERY_MEMOS.map(m => <option key={m}>{m}</option>)}
            </select>
            {form.memo === '직접 입력' && (
              <input value={form.memoCustom} onChange={e => set('memoCustom', e.target.value)}
                placeholder="배송 메모를 입력해 주세요" style={{ ...inputStyle(false), marginTop: '8px' }} />
            )}
          </Field>
        </Section>

        {/* 결제 수단 */}
        <Section title="결제 수단">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                style={{
                  padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                  border: payment === m.id ? '2px solid #094089' : '2px solid #e0e0e0',
                  background: payment === m.id ? '#f0f4ff' : '#fff',
                  color: payment === m.id ? '#094089' : '#555',
                  cursor: 'pointer',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Section>

        {/* 주문 상품 */}
        <div style={{ background: '#fff', marginBottom: '8px' }}>
          <button
            onClick={() => setOrderOpen(o => !o)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 16px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>
              주문 상품 {cart.reduce((s, i) => s + i.qty, 0)}개
            </span>
            <FontAwesomeIcon icon={orderOpen ? faChevronUp : faChevronDown} style={{ color: '#aaa', fontSize: '13px' }} />
          </button>
          {orderOpen && (
            <div style={{ borderTop: '1px solid #f5f5f5', padding: '0 16px 16px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '10px', paddingTop: '14px', alignItems: 'center' }}>
                  <img src={resolveImage(item.image)} alt={item.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', background: '#f5f5f5', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', color: '#111', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>수량 {item.qty}개</p>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#111', flexShrink: 0 }}>
                    {(item.salePrice * item.qty).toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 결제 금액 */}
        <Section title="결제 금액">
          {[
            ['상품 금액', `${totalPrice.toLocaleString()}원`],
            ['배송비', deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>{label}</span>
              <span style={{ fontSize: '13px', color: '#111' }}>{value}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #ebebeb', marginTop: '4px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>최종 결제금액</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#094089' }}>{finalPrice.toLocaleString()}원</span>
          </div>
          {deliveryFee === 0 && (
            <p style={{ fontSize: '11px', color: '#094089', marginTop: '6px', textAlign: 'right' }}>10만원 이상 구매 시 무료배송</p>
          )}
        </Section>

        <div style={{ height: '80px' }} />
      </div>

      {/* 결제 버튼 */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #f0f0f0', background: '#fff', flexShrink: 0 }}>
        {payError && (
          <p style={{ fontSize: '12px', color: '#e03131', marginBottom: '8px', textAlign: 'center' }}>{payError}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={paying}
          style={{
            width: '100%', padding: '15px', background: paying ? '#999' : 'var(--gradient-brand)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700', cursor: paying ? 'wait' : 'pointer',
          }}
        >
          {paying ? '결제 페이지 연결 중...' : `${finalPrice.toLocaleString()}원 결제하기`}
        </button>
      </div>
    </div>
  )
}
