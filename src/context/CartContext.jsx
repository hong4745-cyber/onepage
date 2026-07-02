import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bw_cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('bw_cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, {
        id: product.id, name: product.name, image: product.image,
        salePrice: product.salePrice, price: product.price,
        discountRate: product.discountRate, category: product.category, qty,
      }]
    })
  }

  function removeFromCart(id) { setCart(prev => prev.filter(i => i.id !== id)) }

  function updateQty(id, qty) {
    if (qty <= 0) return removeFromCart(id)
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  function clearCart() { setCart([]) }

  const totalCount = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.salePrice * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
