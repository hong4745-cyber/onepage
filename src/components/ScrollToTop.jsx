import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const el = document.querySelector('.page-scroll')
    if (el) el.scrollTop = 0
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
