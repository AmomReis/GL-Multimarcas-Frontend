import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// O React Router não reseta a rolagem em navegação client-side (SPA) —
// sem isso, ao clicar num link a página nova carrega na posição de
// rolagem em que a anterior tinha ficado, em vez de começar no topo.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
