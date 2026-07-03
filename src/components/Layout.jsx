import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SidebarAccordion from './SidebarAccordion'
import BottomNav from './BottomNav'
import TargetCursor from './ui/TargetCursor'
import TopBanner from './TopBanner'
import SearchOverlay from './SearchOverlay'
import MagicRings from './MagicRings'
import ThemeCompareSlider from './ThemeCompareSlider'
import { useMenu } from '../context/MenuContext'

export default function Layout({ children }) {
  const { overlayOpen, setOverlayOpen } = useMenu()
  const { pathname } = useLocation()

  useEffect(() => {
    setOverlayOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.backgroundImage = ''
  }, [])

  const hideChrome = pathname === '/login'

  return (
    <div className="layout-wrapper">
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} cursorColor="#ffffff" />
      <SidebarAccordion />
      <div className="layout-right-area">
        {/* MagicRings 배경 */}
        <div className="magic-rings-bg">
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
          />
        </div>

        {overlayOpen && (
          <div
            className="menu-overlay"
            onClick={() => setOverlayOpen(false)}
          />
        )}
        <div className="layout-right" style={{ position: 'relative', zIndex: 1 }}>
          <SearchOverlay />
          {!hideChrome && <TopBanner />}
          {children}
          {!hideChrome && <BottomNav />}
        </div>
        <ThemeCompareSlider />
      </div>
    </div>
  )
}
