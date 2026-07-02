import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { resolveImage } from '../utils/imageMap'
import { useCart } from '../context/CartContext'

const COLOR_OPTIONS = {
  '헤드폰':      ['블랙', '화이트', '실버'],
  '이어버드':    ['블랙', '화이트', '베이지'],
  '무선스피커':  ['블랙', '화이트'],
  '라우드스피커':['블랙', '실버'],
  '액세서리':    ['블랙', '화이트', '실버'],
}

const COLOR_MAP = {
  '블랙':  '#1a1a1a',
  '화이트': '#f0f0f0',
  '실버':  '#b0b8c1',
  '베이지': '#d4b896',
  '네이비': '#1b2d5e',
  '골드':  '#c9a84c',
}

export default function CartOptionPopup({ product, onClose }) {
  const { addToCart } = useCart()
  const colors = COLOR_OPTIONS[product.category] || ['블랙', '화이트']
  const [selectedColor, setSelectedColor] = useState(product.color || colors[0])
  const [qty, setQty] = useState(1)

  function handleAdd() {
    addToCart({ ...product, color: selectedColor }, qty)
    onClose()
  }

  const total = product.salePrice * qty

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 600 }}
      />

      {/* 바텀 시트 */}
      <div style={{
        position: 'fixed', left: '50%', transform: 'translateX(-50%)',
        bottom: 0, width: '100%', maxWidth: '600px',
        background: '#fff', borderRadius: '20px 20px 0 0',
        padding: '24px 20px 32px', zIndex: 601, boxSizing: 'border-box',
      }}>
        {/* 핸들 */}
        <div style={{ width: '36px', height: '4px', background: '#e0e0e0', borderRadius: '2px', margin: '0 auto 20px' }} />

        {/* 닫기 */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faXmark} style={{ fontSize: '18px', color: '#aaa' }} />
        </button>

        {/* 상품 요약 */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
          <img
            src={resolveImage(product.image)}
            alt={product.name}
            style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>{product.category}</p>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </p>
          </div>
        </div>

        {/* 색상 선택 */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>색상 선택</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {colors.map(c => {
              const hex = COLOR_MAP[c] || '#ccc'
              const isSelected = selectedColor === c
              const isLight = ['화이트', '베이지', '실버'].includes(c)
              return (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  title={c}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: hex,
                    border: isSelected
                      ? '3px solid var(--c-accent)'
                      : isLight ? '2px solid #ddd' : '2px solid transparent',
                    boxShadow: isSelected ? '0 0 0 2px #fff inset' : 'none',
                    cursor: 'pointer', padding: 0, flexShrink: 0,
                  }}
                />
              )
            })}
            <span style={{ fontSize: '12px', color: '#888', marginLeft: '4px' }}>{selectedColor}</span>
          </div>
        </div>

        {/* 수량 + 금액 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{ width: '32px', height: '32px', border: '1px solid #ddd', borderRadius: '8px 0 0 8px', background: '#fafafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FontAwesomeIcon icon={faMinus} style={{ fontSize: '11px', color: '#555' }} />
            </button>
            <span style={{ width: '44px', height: '32px', border: '1px solid #ddd', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#111' }}>
              {qty}
            </span>
            <button
              onClick={() => setQty(q => q + 1)}
              style={{ width: '32px', height: '32px', border: '1px solid #ddd', borderRadius: '0 8px 8px 0', background: '#fafafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: '11px', color: '#555' }} />
            </button>
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#111' }}>
            {total.toLocaleString()}원
          </p>
        </div>

        {/* 담기 버튼 */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%', padding: '14px', background: 'var(--c-accent)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700', cursor: 'pointer',
          }}
        >
          장바구니 담기
        </button>
      </div>
    </>
  )
}
