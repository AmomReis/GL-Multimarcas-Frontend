import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'gl_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [itens, setItens] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens))
  }, [itens])

  function addItem(produto, quantidade = 1) {
    setItens((prev) => {
      const existente = prev.find((i) => i.id === produto.id)
      if (existente) {
        return prev.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i,
        )
      }
      return [...prev, { ...produto, quantidade }]
    })
  }

  function updateQty(id, quantidade) {
    if (quantidade < 1) return
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, quantidade } : i)))
  }

  function removeItem(id) {
    setItens((prev) => prev.filter((i) => i.id !== id))
  }

  function clear() {
    setItens([])
  }

  const totalItens = useMemo(
    () => itens.reduce((soma, i) => soma + i.quantidade, 0),
    [itens],
  )

  const totalPreco = useMemo(
    () => itens.reduce((soma, i) => soma + i.quantidade * i.preco, 0),
    [itens],
  )

  const value = { itens, addItem, updateQty, removeItem, clear, totalItens, totalPreco }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>')
  return ctx
}
