import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconBag, IconMenu, IconClose, IconShield, IconSearch, IconWhatsApp, IconInstagram } from './icons'
import { useCart } from '../context/CartContext'
import coroa from '../assets/coroa.png'

const LINKS = [
  { to: '/', label: 'Início' },
  { to: '/loja', label: 'Catálogo' },
  { to: '/loja?destaque=1', label: 'Ofertas' },
  { to: '/#marcas', label: 'Marcas' },
  { to: '/#clube', label: 'Clube GL' },
]

// NavLink não é suficiente aqui: ele compara só o pathname, então "Início",
// "Marcas" e "Clube GL" (todos em "/") acendiam juntos, e "Catálogo" ficava
// aceso junto de "Ofertas" (mesmo /loja, query diferente).
function ehAtiva(to, { pathname, search }) {
  // Âncoras da home são atalhos de rolagem, não uma seção onde se "está".
  if (to.startsWith('/#')) return false
  if (to === '/') return pathname === '/'
  if (to === '/loja') return (pathname === '/loja' && !search) || pathname.startsWith('/produto/')
  return `${pathname}${search}` === to
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const { totalItens } = useCart()
  const location = useLocation()
  const botaoMenuRef = useRef(null)
  const drawerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    // passive: o handler nunca chama preventDefault, e sem a flag o Chrome
    // no Android precisa esperar o listener pra decidir se rola a página.
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha o menu ao trocar de página — inclui query e hash porque
  // /loja e /loja?destaque=1 são links diferentes do mesmo pathname.
  useEffect(() => {
    setMenuAberto(false)
  }, [location.pathname, location.search, location.hash])

  // Com o drawer aberto: trava a rolagem do conteúdo atrás (senão o dedo
  // arrasta a página em vez do menu no celular), fecha no Esc e devolve o
  // foco pro botão que abriu.
  useEffect(() => {
    if (!menuAberto) return

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuAberto(false)
        botaoMenuRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    drawerRef.current?.querySelector('a, button')?.focus()

    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuAberto])

  const linksNav = LINKS.map(({ to, label }) => {
    const ativa = ehAtiva(to, location)
    return { to, label, ativa }
  })

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <Link to="/" className="brand-mark">
            <img src={coroa} alt="" className="brand-mark__icon" />
            <span className="brand-mark__text">
              GL <span className="text-gold text-gold-sweep">MULTIMARCAS</span>
            </span>
          </Link>

          {/* Navegação inline — só em telas largas, onde sobra espaço. No
              celular esses mesmos links vivem no drawer. */}
          <nav className="header__nav" aria-label="Navegação principal">
            {linksNav.map(({ to, label, ativa }) => (
              <Link
                key={to}
                to={to}
                className={`header__nav-link ${ativa ? 'is-active' : ''}`}
                aria-current={ativa ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <Link to="/loja" className="icon-btn header__busca-btn" aria-label="Buscar produtos">
              <IconSearch className="icon-btn__icon" />
            </Link>

            <Link
              to="/carrinho"
              className="icon-btn"
              aria-label={`Ver sacola (${totalItens} ${totalItens === 1 ? 'item' : 'itens'})`}
              data-cart-target="secondary"
            >
              <IconBag className="icon-btn__icon" />
              {totalItens > 0 && <span className="icon-btn__badge">{totalItens}</span>}
            </Link>

            <Link to="/admin" className="icon-btn header__admin-btn" aria-label="Painel admin">
              <IconShield className="icon-btn__icon" />
            </Link>

            <button
              ref={botaoMenuRef}
              type="button"
              className="icon-btn header__menu-btn"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
              onClick={() => setMenuAberto((v) => !v)}
            >
              {menuAberto ? <IconClose className="icon-btn__icon" /> : <IconMenu className="icon-btn__icon" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fora do <header> de propósito: ele tem backdrop-filter, e um
          elemento com filtro vira bloco de contenção pros position:fixed
          descendentes — dentro dele o drawer ficava preso à altura da
          barra em vez de ocupar a tela inteira. */}
      <div
        className={`drawer-backdrop ${menuAberto ? 'is-open' : ''}`}
        onClick={() => setMenuAberto(false)}
        aria-hidden="true"
      />

      <nav
        id="menu-mobile"
        ref={drawerRef}
        className={`drawer ${menuAberto ? 'is-open' : ''}`}
        aria-label="Menu"
        aria-hidden={!menuAberto}
        // inert por atributo: sem isso o drawer fechado continua na ordem
        // de tabulação (ele só sai da tela via transform).
        {...(!menuAberto ? { inert: '' } : {})}
      >
        <div className="drawer__header">
          <span className="drawer__title">Menu</span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <IconClose className="icon-btn__icon" />
          </button>
        </div>

        <div className="drawer__links">
          {linksNav.map(({ to, label, ativa }) => (
            <Link
              key={to}
              to={to}
              className={`drawer__link ${ativa ? 'is-active' : ''}`}
              aria-current={ativa ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link to="/carrinho" className="drawer__link">
            Sacola
            {totalItens > 0 && <span className="drawer__link-badge">{totalItens}</span>}
          </Link>
          {/* No celular o escudo do admin sai da barra pra não disputar
              espaço com a sacola — o acesso continua aqui. */}
          <Link to="/admin" className="drawer__link drawer__link--admin">
            <IconShield aria-hidden="true" />
            Painel admin
          </Link>
        </div>

        <div className="drawer__footer">
          <p className="drawer__footer-label">Fale com a gente</p>
          <div className="drawer__social">
            <a
              href="https://wa.me/559186206409"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer__social-link"
            >
              <IconWhatsApp aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/glmultimarcas0fc/"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer__social-link"
            >
              <IconInstagram aria-hidden="true" />
              Instagram
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
