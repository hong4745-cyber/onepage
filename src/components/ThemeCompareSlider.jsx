import { useState, useEffect } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

export default function ThemeCompareSlider() {
  const [blackVersion, setBlackVersion] = useState(false)

  useEffect(() => {
    const page = document.querySelector('.layout-right')
    page?.classList.toggle('bw-invert', blackVersion)
    return () => page?.classList.remove('bw-invert')
  }, [blackVersion])

  return (
    <button
      onClick={() => setBlackVersion(v => !v)}
      title={blackVersion ? '화이트 버전으로' : '블랙 버전으로'}
      style={{
        position: 'fixed', bottom: '20px', right: '20px', zIndex: 400,
        width: '44px', height: '44px', borderRadius: '50%',
        background: blackVersion ? '#111' : '#fff',
        color: blackVersion ? '#fff' : '#111',
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '17px',
      }}
    >
      {blackVersion ? <FiSun /> : <FiMoon />}
    </button>
  )
}
