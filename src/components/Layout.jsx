import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SidebarAccordion from './SidebarAccordion'
import BottomNav from './BottomNav'
import TargetCursor from './ui/TargetCursor'
import TopBanner from './TopBanner'
import SearchOverlay from './SearchOverlay'
import MagicRings from './MagicRings'
import ThemeCompareSlider from './ThemeCompareSlider'
import FloatingActions from './FloatingActions'
import { useMenu } from '../context/MenuContext'

const RING_BASE_OFFSET_X = 0.1

export default function Layout({ children }) {
  const { overlayOpen, setOverlayOpen } = useMenu()
  const { pathname } = useLocation()
  useEffect(() => {
    setOverlayOpen(false)
  }, [pathname])

  const handleBgClick = () => {
    setOverlayOpen(o => !o)
  }

  useEffect(() => {
    document.body.style.backgroundImage = ''
  }, [])

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', overlayOpen)
    return () => document.body.classList.remove('sidebar-open')
  }, [overlayOpen])

  const hideChrome = pathname === '/login'

  return (
    <div className="layout-wrapper">
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} cursorColor="#ffffff" />
      <SidebarAccordion />
      {!hideChrome && (
        <button
          className={`sidebar-hint-tab${overlayOpen ? ' sidebar-hint-tab--hidden' : ''}`}
          onClick={() => setOverlayOpen(true)}
          aria-label="메뉴 열기"
        >
          <svg width="10" height="18" viewBox="0 0 7 12" fill="none">
            <polyline points="1,1 6,6 1,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <div className="layout-right-area">
        {/* MagicRings 배경 — 클릭하면 사이드바가 열림 */}
        <div className="magic-rings-bg" onClick={handleBgClick}>
          <MagicRings
            color="#cccccc"
            colorTwo="#f0f0f0"
            ringCount={6}
            speed={0.7}
            attenuation={9}
            lineThickness={2}
            baseRadius={0.3}
            radiusStep={0.12}
            scaleRate={0.12}
            opacity={0.35}
            blur={0}
            noiseAmount={0.08}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={true}
            mouseInfluence={0.15}
            hoverScale={1.15}
            parallax={0.04}
            clickBurst={true}
            centerOffsetX={RING_BASE_OFFSET_X}
          />
        </div>

        <div className="layout-right" style={{ position: 'relative', zIndex: 1 }}>
          <SearchOverlay />
          {!hideChrome && <TopBanner />}
          {children}
          {!hideChrome && <BottomNav />}
        </div>
        {!hideChrome && <FloatingActions />}
        <ThemeCompareSlider />
      </div>
    </div>
  )
}
