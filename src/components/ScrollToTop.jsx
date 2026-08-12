import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// O React Router não mexe na rolagem em navegação client-side (SPA):
// - sem hash, a página nova carregava na posição em que a anterior tinha
//   ficado, em vez de começar no topo;
// - com hash (/#marcas), o alvo era simplesmente ignorado — por isso esses
//   links eram <a href> de página inteira antes, com recarregamento completo.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // O elemento pode ainda não estar montado no mesmo tick da troca de
      // rota (ex: vindo de /loja pra /#marcas), daí o rAF.
      const alvo = () => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      requestAnimationFrame(alvo)
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
