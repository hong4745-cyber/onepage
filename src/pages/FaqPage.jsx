import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterChipsBar from '../components/FilterChipsBar'

const FAQ_LIST = [
  {
    q: '배송은 얼마나 걸리나요?',
    a: '주문 후 2–3 영업일 이내 출고되며, 도서산간 지역은 추가 1–2일이 소요될 수 있습니다.',
  },
  {
    q: '반품/교환은 어떻게 하나요?',
    a: '수령 후 7일 이내 고객센터로 문의해 주세요. 제품 하자 시 무상 교환 가능합니다.',
  },
  {
    q: 'A/S 서비스는 어디서 받나요?',
    a: '공식 서비스 센터 또는 온라인 A/S 신청을 통해 이용하실 수 있습니다.',
  },
  {
    q: '정품 등록은 어떻게 하나요?',
    a: '구매 후 공식 홈페이지에서 제품 시리얼 번호로 등록하시면 보증 기간이 연장됩니다.',
  },
  {
    q: '해외 배송도 가능한가요?',
    a: '현재 국내 배송만 지원하고 있으며, 해외 배송은 추후 안내 예정입니다.',
  },
  {
    q: '결제 수단은 어떤 것이 있나요?',
    a: '신용/체크카드, 계좌이체, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.',
  },
  {
    q: '제품 보증 기간은 얼마나 되나요?',
    a: '모든 제품은 구매일로부터 2년간 제조사 보증을 받으실 수 있습니다. 정품 등록 시 추가 혜택이 제공됩니다.',
  },
]

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const navigate = useNavigate()

  return (
    <div className="page-root">
      <Header showBack title="자주 묻는 질문" />
      <div className="page-scroll">
        <FilterChipsBar />
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px', lineHeight: '1.6' }}>
            궁금하신 점을 아래에서 확인해 보세요.
          </p>
          {FAQ_LIST.map((item, i) => (
            <div key={i} style={{ borderTop: '1px solid #ebebeb' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#111',
                  textAlign: 'left',
                  cursor: 'pointer',
                  gap: '8px',
                }}
              >
                <span>Q. {item.q}</span>
                <FontAwesomeIcon
                  icon={openFaq === i ? faMinus : faPlus}
                  style={{ color: '#aaa', fontSize: '14px', flexShrink: 0 }}
                />
              </button>
              {openFaq === i && (
                <p
                  style={{
                    fontSize: '13px',
                    color: '#555',
                    lineHeight: '1.8',
                    background: '#fafafa',
                    margin: '0 -16px',
                    padding: '12px 16px 16px',
                  }}
                >
                  A. {item.a}
                </p>
              )}
            </div>
          ))}
          <div style={{ borderTop: '1px solid #ebebeb', marginBottom: '32px' }} />

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '12px' }}>
              원하시는 답변을 찾지 못하셨나요?
            </p>
            <button
              onClick={() => navigate('/qna')}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '13px',
                color: '#555',
                cursor: 'pointer',
              }}
            >
              1:1 문의하기
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
