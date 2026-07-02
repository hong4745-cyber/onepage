import { createContext, useContext, useState } from 'react'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const [overlayOpen, setOverlayOpen] = useState(false)
  return (
    <MenuContext.Provider value={{ overlayOpen, setOverlayOpen }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  return useContext(MenuContext)
}
