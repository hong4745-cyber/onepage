import heroImg from './assets/images/main/1_main_1.png'
import logoImg from './assets/images/0_logo.png'

export default function CompanyIntro() {
  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', fontFamily: 'sans-serif', color: '#222', background: '#fff' }}>

      {/* 상단 알림 배너 */}
      <div style={{ background: '#1a1a2e', color: '#fff', textAlign: 'center', fontSize: '12px', padding: '8px 16px', position: 'relative' }}>
        지금 가입하고 소중한 혜택 받아가세요!
        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>✕</span>
      </div>

      {/* 헤더 */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #eee' }}>
        <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>☰</button>
        <span style={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.5px' }}>Bowers &amp; Wilkins</span>
        <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>⚙</button>
      </header>

      {/* 히어로 섹션 */}
      <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <img src={heroImg} alt="hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px'
        }}>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>특별한 경험을 나누다.</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0 }}>Bowers &amp; Wilkins와 함께하는 일상</p>
        </div>
      </div>

      {/* 본문 섹션들 */}
      <div style={{ padding: '0 20px' }}>

        <section style={{ padding: '32px 0 24px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>바워스앤윌킨스는</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#444' }}>
            1966년 영국에서 설립된 Bowers &amp; Wilkins는 반세기가 넘는 시간 동안 오직 하나의 목표,
            '완벽한 소리'를 향해 달려왔습니다. 스튜디오 모니터부터 가정용 스피커, 헤드폰까지
            모든 제품에 타협 없는 음향 철학을 담아 전 세계 청음 애호가들의 신뢰를 얻고 있습니다.
          </p>
        </section>

        <section style={{ padding: '24px 0', borderBottom: '1px solid #eee' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>완벽함 향한 한 걸음</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#444' }}>
            당사의 엔지니어들은 최신 음향 기술과 정밀 소재 연구를 끊임없이 수행하며,
            단 하나의 드라이버 구조에도 수백 시간의 실험을 거칩니다. 그 결과 탄생한
            제품은 단순한 도구가 아닌, 감동을 전하는 악기가 됩니다.
          </p>
        </section>

        <section style={{ padding: '24px 0', borderBottom: '1px solid #eee' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>자유로운 디자인의 흐름</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#444' }}>
            기능성과 미학의 균형을 통해 Bowers &amp; Wilkins의 제품은 어떤 공간에서도
            자연스럽게 어우러집니다. 정제된 곡선과 프리미엄 마감재는 보는 것만으로도
            즐거움을 선사하며, 사용자의 라이프스타일을 품격 있게 완성합니다.
          </p>
        </section>

        <section style={{ padding: '24px 0', borderBottom: '1px solid #eee' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>지속 가능한 가치</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#444' }}>
            우리는 환경을 생각하는 책임 있는 제조를 지향합니다. 재활용 가능한 소재 사용,
            에너지 효율적인 생산 공정을 통해 다음 세대에도 아름다운 소리를 물려줄 수 있도록
            지속 가능한 미래를 만들어 나갑니다.
          </p>
        </section>

        {/* 연락처 섹션 */}
        <section style={{ padding: '28px 0 24px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' }}>Bowers &amp; Wilkins</p>
          {['브랜드 파트너십', '마케팅', '미디어관련', '채용문의'].map((item) => (
            <div key={item} style={{
              padding: '12px 0',
              borderTop: '1px solid #eee',
              fontSize: '13px',
              color: '#333',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {item}
              <span style={{ color: '#aaa' }}>›</span>
            </div>
          ))}
        </section>

      </div>

      {/* 푸터 */}
      <footer style={{ background: '#f8f8f8', padding: '16px 20px', textAlign: 'center', fontSize: '11px', color: '#999', borderTop: '1px solid #eee' }}>
        Copyright © Lifesonic All rights reserved.
      </footer>

    </div>
  )
}
