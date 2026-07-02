import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bw_wishlist')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('bw_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  function toggleWishlist(product) {
    setWishlist(prev => {
      if (prev.some(i => i.id === product.id)) return prev.filter(i => i.id !== product.id)
      return [...prev, {
        id: product.id, name: product.name, image: product.image,
        salePrice: product.salePrice, price: product.price,
        discountRate: product.discountRate, category: product.category,
        rating: product.rating, reviewCount: product.reviewCount,
        isBest: product.isBest, isNew: product.isNew, isSale: product.isSale,
      }]
    })
  }

  function removeFromWishlist(id) { setWishlist(prev => prev.filter(i => i.id !== id)) }

  function isWished(id) { return wishlist.some(i => i.id === id) }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isWished, wishCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() { return useContext(WishlistContext) }
