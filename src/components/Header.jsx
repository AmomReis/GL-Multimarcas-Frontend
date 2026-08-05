import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconCrown, IconBag, IconMenu, IconClose } from './icons'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const { totalItens } = useCart()
  const { autenticado } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha o menu automaticamente ao trocar de página.
  useEffect(() => {
    setMenuAberto(false)
  }, [location.pathname])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="brand-mark">
          <IconCrown className="brand-mark__icon" aria-hidden="true" />
          <span className="brand-mark__text">
            GL <span className="text-gold text-gold-sweep">MULTIMARCAS</span>
          </span>
        </Link>

        <div className="header__actions">
          <Link to="/carrinho" className="icon-btn" aria-label="Ver sacola" data-cart-target="secondary">
            <IconBag className="icon-btn__icon" />
            {totalItens > 0 && <span className="icon-btn__badge">{totalItens}</span>}
          </Link>

          <button
            type="button"
            className="icon-btn"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? <IconClose className="icon-btn__icon" /> : <IconMenu className="icon-btn__icon" />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="header__menu" aria-label="Menu">
          <Link to="/loja" onClick={() => setMenuAberto(false)}>Catálogo completo</Link>
          <Link to="/loja?destaque=1" onClick={() => setMenuAberto(false)}>Ofertas da semana</Link>
          <a href="/#marcas" onClick={() => setMenuAberto(false)}>Marcas</a>
          <a href="/#clube" onClick={() => setMenuAberto(false)}>Clube GL</a>
          <Link to="/carrinho" onClick={() => setMenuAberto(false)}>Sacola</Link>
          {autenticado ? (
            <Link to="/conta" onClick={() => setMenuAberto(false)}>Minha conta</Link>
          ) : (
            <Link to="/entrar" onClick={() => setMenuAberto(false)}>Entrar / Criar conta</Link>
          )}
        </nav>
      )}
    </header>
  )
}
