import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 21st.dev interactive-image-accordion을 프로젝트 스택(JS + 인라인 스타일)에 맞게 변환.
// 호버하면 해당 이미지 카드가 가로로 확장되고, 캡션이 세로(rotate 90°)→가로로 회전.
// 확장된 카드 안에는 서브 메뉴 링크가 표시된다.

function AccordionItem({ item, isActive, onMouseEnter, activeWidth, collapsedWidth, height }) {
  const navigate = useNavigate()

  return (
    <div
      onMouseEnter={onMouseEnter}
      style={{
        position: 'relative',
        height: `${height}px`,
        width: isActive ? `${activeWidth}px` : `${collapsedWidth}px`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* 배경 이미지 */}
      <img
        src={item.imageUrl}
        alt={item.title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* 가독성용 어두운 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(4, 9, 34, 0.6)' }} />

      {/* 서브 메뉴 (활성 카드에서만 페이드 인) */}
      {item.items?.length > 0 && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            padding: '22px 18px 56px',
            display: 'flex', flexDirection: 'column', gap: '2px',
            overflow: 'hidden',
            opacity: isActive ? 1 : 0,
            transition: isActive ? 'opacity 0.4s ease 0.35s' : 'opacity 0.15s ease',
            pointerEvents: isActive ? 'auto' : 'none',
          }}
        >
          <p style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.5)',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            marginBottom: '10px', fontWeight: '600', whiteSpace: 'nowrap',
          }}>
            MENU
          </p>
          {item.items.map(sub => (
            <button
              key={sub.label}
              onClick={() => navigate(sub.path)}
              style={{
                background: 'none', border: 'none',
                color: '#fff', fontSize: '13px',
                textAlign: 'left', cursor: 'pointer',
                padding: '7px 0',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--c-accent-light, #7cc4ff)'; e.currentTarget.style.paddingLeft = '4px' }}
              onMouseOut={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '0' }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* 캡션 — 비활성: 세로(90° 회전), 활성: 하단 중앙 가로 */}
      <span
        style={{
          position: 'absolute', zIndex: 2,
          color: '#fff', fontSize: '14px', fontWeight: '600',
          whiteSpace: 'nowrap', left: '50%',
          bottom: isActive ? '20px' : '96px',
          transform: isActive
            ? 'translateX(-50%) rotate(0deg)'
            : 'translateX(-50%) rotate(90deg)',
          transition: 'all 0.3s ease-in-out',
          pointerEvents: 'none',
        }}
      >
        {item.title}
      </span>
    </div>
  )
}

/**
 * items: [{ id, title, imageUrl, items?: [{ label, path }] }]
 * 사이드바(360px) 기준 기본 치수 — 다른 곳에 쓸 때는 props로 조정
 */
export function InteractiveImageAccordion({
  items,
  defaultActive = 0,
  activeWidth = 215,
  collapsedWidth = 32,
  height = 450,
  gap = 8,
}) {
  const [activeIndex, setActiveIndex] = useState(defaultActive)

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: `${gap}px` }}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
          activeWidth={activeWidth}
          collapsedWidth={collapsedWidth}
          height={height}
        />
      ))}
    </div>
  )
}
