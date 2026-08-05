import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Garante que toda navegação (inclusive dentro do admin) comece no topo da
// página, em vez de manter a posição de rolagem da página anterior.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
