import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const ITEMS = [
  {
    label: '개인정보 처리방침',
    content: 'Bowers & Wilkins Korea는 회원님의 개인정보를 소중하게 생각합니다. 수집된 개인정보(이름, 연락처, 배송지 등)는 주문 처리와 고객 지원 목적으로만 사용되며, 관련 법령에 따라 안전하게 보관 후 파기됩니다. 회원님은 언제든지 개인정보 열람·정정·삭제를 요청하실 수 있습니다.',
  },
  {
    label: '이용약관',
    content: '본 약관은 Bowers & Wilkins Korea 온라인 스토어에서 제공하는 서비스 이용 조건을 규정합니다. 회원 가입 시 본 약관에 동의한 것으로 간주되며, 상품 주문·결제·배송·반품 등 모든 거래는 전자상거래법 및 소비자보호법을 준수하여 처리됩니다.',
  },
  {
    label: '이용안내',
    content: '주문은 온라인 스토어에서 24시간 가능합니다. 결제 완료 후 2–3 영업일 이내 출고되며, 도서산간 지역은 1–2일 추가 소요될 수 있습니다. 수령 후 7일 이내 미개봉 상품은 반품이 가능하며, 제품 하자 시 무상 교환해 드립니다. 고객센터: 1588-0000 (평일 09:00–18:00)',
  },
  {
    label: '제휴문의',
    content: '브랜드 파트너십, 마케팅, 미디어, B2B 대량 구매 관련 문의는 partnership@bowerswilkins.kr 로 제안서와 함께 보내주세요. 검토 후 영업일 기준 5일 이내에 회신드립니다.',
  },
]

export default function Footer() {
  const [open, setOpen] = useState(null)

  return (
    <footer style={{
      background: '#fff',
      padding: '36px 20px 28px',
    }}>
      <p style={{ fontSize: '17px', fontWeight: '700', color: '#111', marginBottom: '18px', letterSpacing: '0.2px' }}>
        Bowers &amp; Wilkins
      </p>

      <div style={{ marginBottom: '24px' }}>
        {ITEMS.map(({ label, content }, i) => (
          <div key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                textAlign: 'left',
                padding: '15px 2px',
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: '#333',
                cursor: 'pointer',
              }}
            >
              {label}
              <FontAwesomeIcon
                icon={open === i ? faMinus : faPlus}
                style={{ color: '#bbb', fontSize: '11px', flexShrink: 0, marginLeft: '8px' }}
              />
            </button>
            {open === i && (
              <p style={{
                fontSize: '12px', color: '#888', lineHeight: 1.8,
                padding: '0 2px 16px', textAlign: 'justify', wordBreak: 'break-all',
              }}>
                {content}
              </p>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: '11px', color: '#aaa' }}>
        Copyright ⓒ bowerswilkins All right reserved.
      </p>
    </footer>
  )
}
