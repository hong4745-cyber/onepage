import { useState, useRef, useEffect } from 'react'
import { FiMoon, FiX } from 'react-icons/fi'

export default function ThemeCompareSlider() {
  const [enabled, setEnabled] = useState(false)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)
  const areaRef = useRef(null)

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current || !areaRef.current) return
      const rect = areaRef.current.getBoundingClientRect()
      const x = e.touches ? e.touches[0].clientX : e.clientX
      const pct = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100))
      setPos(pct)
    }
    function onUp() { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <>
      {enabled && (
        <div ref={areaRef} className="theme-compare-overlay">
          {/* 다크 반전 영역 — 핸들 오른쪽 */}
          <div style={{
            position: 'absolute', inset: 0,
            clipPath: `inset(0 0 0 ${pos}%)`,
            backdropFilter: 'invert(0.92) hue-rotate(180deg)',
            WebkitBackdropFilter: 'invert(0.92) hue-rotate(180deg)',
            pointerEvents: 'none',
          }} />

          {/* 구분선 */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: `${pos}%`,
            width: '2px', transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.55)',
            boxShadow: '0 0 8px rgba(0,0,0,0.35)',
            pointerEvents: 'none',
          }} />

          {/* 드래그 핸들 */}
          <div
            onMouseDown={e => { e.preventDefault(); dragging.current = true }}
            onTouchStart={() => { dragging.current = true }}
            style={{
              position: 'absolute', top: '50%', left: `${pos}%`,
              transform: 'translate(-50%, -50%)',
              width: '26px', height: '36px', borderRadius: '5px',
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
              cursor: 'ew-resize', pointerEvents: 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '3px',
            }}
          >
            <span style={{ width: '1.5px', height: '14px', background: '#bbb', borderRadius: '1px' }} />
            <span style={{ width: '1.5px', height: '14px', background: '#bbb', borderRadius: '1px' }} />
          </div>
        </div>
      )}

      {/* 토글 버튼 */}
      <button
        onClick={() => setEnabled(v => !v)}
        title={enabled ? '비교 모드 끄기' : '화이트/블랙 비교'}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 400,
          width: '44px', height: '44px', borderRadius: '50%',
          background: enabled ? '#111' : '#fff',
          color: enabled ? '#fff' : '#111',
          border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '17px',
        }}
      >
        {enabled ? <FiX /> : <FiMoon />}
      </button>
    </>
  )
}
