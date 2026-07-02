import heroImg from '../assets/images/bg/bg_2.jpg'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterChipsBar from '../components/FilterChipsBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const SECTIONS = [
  {
    title: '바워스앤윌킨스는',
    body: '1966년 영국에서 설립된 Bowers & Wilkins는 반세기가 넘는 시간 동안 오직 하나의 목표, \'완벽한 소리\'를 향해 달려왔습니다. 스튜디오 모니터부터 가정용 스피커, 헤드폰까지 모든 제품에 타협 없는 음향 철학을 담아 전 세계 청음 애호가들의 신뢰를 얻고 있습니다.',
  },
  {
    title: '완벽함 향한 한 걸음',
    body: '당사의 엔지니어들은 최신 음향 기술과 정밀 소재 연구를 끊임없이 수행하며, 단 하나의 드라이버 구조에도 수백 시간의 실험을 거칩니다. 그 결과 탄생한 제품은 단순한 도구가 아닌, 감동을 전하는 악기가 됩니다.',
  },
  {
    title: '자유로운 디자인의 흐름',
    body: '기능성과 미학의 균형을 통해 Bowers & Wilkins의 제품은 어떤 공간에서도 자연스럽게 어우러집니다. 정제된 곡선과 프리미엄 마감재는 보는 것만으로도 즐거움을 선사하며, 사용자의 라이프스타일을 품격 있게 완성합니다.',
  },
  {
    title: '지속 가능한 가치',
    body: '우리는 환경을 생각하는 책임 있는 제조를 지향합니다. 재활용 가능한 소재 사용, 에너지 효율적인 생산 공정을 통해 다음 세대에도 아름다운 소리를 물려줄 수 있도록 지속 가능한 미래를 만들어 나갑니다.',
  },
]

const CONTACTS = ['브랜드 파트너십', '마케팅', '미디어관련', '채용문의']

export default function CompanyIntroPage() {
  return (
    <div className="page-root">
      <Header />
      <div className="page-scroll">
        <FilterChipsBar />

        {/* Hero */}
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
          <img src={heroImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center', padding: '24px',
          }}>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
              특별한 경험을 나누다.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
              Bowers &amp; Wilkins와 함께하는 일상
            </p>
          </div>
        </div>

        {/* Sections */}
        <div style={{ padding: '0 20px' }}>
          {SECTIONS.map((s, i) => (
            <section key={i} style={{ padding: '28px 0', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px', color: 'var(--c-primary)' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', lineHeight: '1.85', color: '#555', textAlign: 'justify', wordBreak: 'break-all' }}>{s.body}</p>
            </section>
          ))}

          {/* Contact */}
          <section style={{ padding: '28px 0 0' }}>
            <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '16px', color: '#111' }}>
              Bowers &amp; Wilkins
            </p>
            {CONTACTS.map(item => (
              <div
                key={item}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 0', borderTop: '1px solid #f0f0f0',
                  fontSize: '13px', color: '#333', cursor: 'pointer',
                }}
              >
                {item}
                <FontAwesomeIcon icon={faChevronRight} style={{ color: '#ccc', fontSize: '13px' }} />
              </div>
            ))}
          </section>
        </div>

        <Footer />
      </div>
    </div>
  )
}
