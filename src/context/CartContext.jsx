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

  // Duas linhas do mesmo produto só são "o mesmo item" se o tamanho também
  // bater — assim dá pra ter 1x camisa P e 1x camisa M na sacola ao mesmo
  // tempo. Produto sem tamanho tem tamanho undefined/null dos dois lados.
  function mesmoItem(a, b) {
    return a.id === b.id && (a.tamanho || null) === (b.tamanho || null)
  }

  function addItem(produto, quantidade = 1) {
    setItens((prev) => {
      const existente = prev.find((i) => mesmoItem(i, produto))
      if (existente) {
        return prev.map((i) =>
          mesmoItem(i, produto) ? { ...i, quantidade: i.quantidade + quantidade } : i,
        )
      }
      return [...prev, { ...produto, quantidade }]
    })
  }

  function updateQty(id, tamanho, quantidade) {
    if (quantidade < 1) return
    setItens((prev) => prev.map((i) => (mesmoItem(i, { id, tamanho }) ? { ...i, quantidade } : i)))
  }

  function removeItem(id, tamanho) {
    setItens((prev) => prev.filter((i) => !mesmoItem(i, { id, tamanho })))
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
